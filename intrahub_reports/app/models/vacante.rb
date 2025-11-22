class Vacante < ApplicationRecord
  self.table_name = "vacantes"

  has_many :postulaciones, foreign_key: "vacancy_id"
end
