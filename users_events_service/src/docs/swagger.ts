import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function initSwagger(app) {
  const config = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API Docs")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);
}
