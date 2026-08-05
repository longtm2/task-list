module Api
  module Entities
    class AttachmentEntity < Grape::Entity
      format_with(:iso8601) { |datetime| datetime&.iso8601 }

      expose :id, documentation: { type: "Integer", desc: "Attachment id" }
      expose :filename, documentation: { type: "String", desc: "Original file name" } do |attachment|
        attachment.filename.to_s
      end
      expose :content_type, documentation: { type: "String", desc: "File MIME type" }
      expose :byte_size, documentation: { type: "Integer", desc: "File size in bytes" }
      expose :created_at, format_with: :iso8601, documentation: { type: "DateTime", desc: "Upload time" }
      expose :download_url, documentation: { type: "String", desc: "Authenticated download URL" } do |attachment|
        "/api/v1/tasks/#{attachment.record_id}/attachments/#{attachment.id}/download"
      end
    end
  end
end
