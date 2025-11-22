class MetricsController < ApplicationController
  def index
    from = params[:from] || "2000-01-01"
    to   = params[:to]   || Date.today.to_s

    # Noticias por mes
    news = News.where(published_at: from..to)
               .group("DATE_FORMAT(published_at, '%Y-%m')")
               .count

    # Vacantes con más postulaciones
    top_vacantes = Postulacion.joins(:vacante)
      .where(created_at: from..to)
      .group("vacantes.titulo")
      .count
      .sort_by { |_k, v| -v }
      .first(10)
      .to_h

    # Boletas generadas por periodo
    payslips = Payslip.where(created_at: from..to)
      .group("DATE_FORMAT(created_at, '%Y-%m')")
      .select("DATE_FORMAT(created_at, '%Y-%m') AS periodo, COUNT(*) AS total, SUM(salario_neto) AS monto_total")

    render json: {
      from: from,
      to: to,
      news_per_month: news,
      top_vacantes: top_vacantes,
      payslips_summary: payslips
    }
  end
end
