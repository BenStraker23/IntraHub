class Postulacion < ApplicationRecord
  self.table_name = "postulaciones"   # Usa la tabla creada por Laravel

  belongs_to :vacante, class_name: "Vacante", foreign_key: "vacante_id", optional: true
  belongs_to :user, class_name: "User", foreign_key: "user_id", optional: true
end
