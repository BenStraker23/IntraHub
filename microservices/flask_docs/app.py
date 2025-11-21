import os
import uuid
import hashlib
from dotenv import load_dotenv

from flask import Flask, request, jsonify, send_file, abort, url_for
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired

from models import db, Payslip
from pdf_utils import generate_payslip_pdf

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:@localhost/intrahub_docs"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-change-me")
    PAYSLIP_STORAGE = os.path.join(
        BASE_DIR,
        os.getenv("PAYSLIP_STORAGE", "storage/payslips")
    )

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    db.init_app(app)

    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])

    os.makedirs(app.config["PAYSLIP_STORAGE"], exist_ok=True)

    @app.route("/api/payslips/generate", methods=["POST"])
    def generate_payslip():
        data = request.get_json() or {}

        required = ["employee_id", "employee_name", "period", "gross_amount", "net_amount"]
        missing = [f for f in required if f not in data]

        if missing:
            return jsonify({
                "message": "Faltan campos requeridos",
                "missing": missing
            }), 422

        slip_uuid = str(uuid.uuid4())
        filename = f"{slip_uuid}.pdf"
        pdf_path = os.path.join(app.config["PAYSLIP_STORAGE"], filename)

        generate_payslip_pdf(pdf_path, data)

        sha256_hash = hashlib.sha256()
        with open(pdf_path, "rb") as f:
            sha256_hash.update(f.read())
        sha256_hex = sha256_hash.hexdigest()

        payslip = Payslip(
            uuid=slip_uuid,
            employee_id=data["employee_id"],
            employee_name=data["employee_name"],
            period=data["period"],
            gross_amount=float(data["gross_amount"]),
            net_amount=float(data["net_amount"]),
            sha256=sha256_hex,
            file_path=pdf_path,    
        )

        db.session.add(payslip)
        db.session.commit()

        token = serializer.dumps({"uuid": slip_uuid})
        download_url = url_for(
            "download_payslip",
            uuid=slip_uuid,
            token=token,
            _external=True
        )

        return jsonify({
            "message": "Boleta generada correctamente",
            "uuid": slip_uuid,
            "sha256": sha256_hex,
            "download_url": download_url,
        }), 201

    @app.route("/api/payslips/<uuid>/download", methods=["GET"])
    def download_payslip(uuid):
        token = request.args.get("token")
        if not token:
            return jsonify({"message": "Token requerido"}), 401

        try:
            data = serializer.loads(token, max_age=3600)
        except SignatureExpired:
            return jsonify({"message": "Token expirado"}), 401
        except BadSignature:
            return jsonify({"message": "Token inválido"}), 401

        if data.get("uuid") != uuid:
            return jsonify({"message": "Token incorrecto"}), 401

        payslip = Payslip.query.filter_by(uuid=uuid).first()
        if not payslip or not os.path.exists(payslip.file_path):
            return jsonify({"message": "Boleta no encontrada"}), 404

        return send_file(
            payslip.file_path,
            as_attachment=True,
            download_name=f"payslip_{uuid}.pdf",
            mimetype="application/pdf"
        )

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5001, debug=True)
