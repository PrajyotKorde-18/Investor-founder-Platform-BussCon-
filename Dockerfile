# Build stage
FROM maven:3.9.6-eclipse-temurin-22-alpine AS build
WORKDIR /app

# Copy pom.xml and dependency definitions
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Run stage
FROM eclipse-temurin:22-jre-alpine
WORKDIR /app
COPY --from=build /app/target/busscon-backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
