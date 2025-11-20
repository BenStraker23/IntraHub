import os
from fpdf import FPDF

def generate_payslip_pdf(output_path: str, data: dict):
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Boleta de Pago - IntraHub", ln=True, align="C")

    pdf.ln(5)
    pdf.set_font("Arial", "", 12)
    pdf.cell(0, 8, f"Empleado: {data['employee_name']} (ID: {data['employee_id']})", ln=True)
    pdf.cell(0, 8, f"Periodo: {data['period']}", ln=True)
    pdf.ln(5)

    pdf.cell(0, 8, f"Salario bruto: Q{data['gross_amount']}", ln=True)
    pdf.cell(0, 8, f"Salario neto: Q{data['net_amount']}", ln=True)

    pdf.output(output_path)
