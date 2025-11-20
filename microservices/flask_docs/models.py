from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Payslip(db.Model):
    __tablename__ = "payslips"

    id = db.Column(db.Integer, primary_key=True)
    uuid = db.Column(db.String(36), unique=True, nullable=False)

    employee_id = db.Column(db.String(50), nullable=False)
    employee_name = db.Column(db.String(150), nullable=False)
    period = db.Column(db.String(20), nullable=False)

    gross_amount = db.Column(db.Float, nullable=False)
    net_amount = db.Column(db.Float, nullable=False)

    sha256 = db.Column(db.String(64), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
