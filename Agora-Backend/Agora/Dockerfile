FROM eclipse-temurin:17-jre

WORKDIR /app

COPY target/Agora-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 9000

# 5. Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
