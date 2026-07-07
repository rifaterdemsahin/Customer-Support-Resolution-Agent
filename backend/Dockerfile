FROM golang:1.25-alpine AS builder
ENV GOTOOLCHAIN=local
WORKDIR /app
COPY backend/go.mod backend/go.sum ./
RUN go mod download
COPY backend/main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -o /csra-server .

FROM alpine:3.21
RUN apk --no-cache add ca-certificates
COPY --from=builder /csra-server /csra-server
COPY index.html /static/index.html
COPY act1.html /static/act1.html
COPY act2.html /static/act2.html
COPY act3.html /static/act3.html
COPY combined.html /static/combined.html
COPY media.html /static/media.html
COPY methodology.html /static/methodology.html
COPY challenge.html /static/challenge.html
COPY docs/ /static/docs/
COPY scenes/ /static/scenes/
COPY generated-images/ /static/generated-images/
COPY generated-audio/ /static/generated-audio/
COPY infographic/ /static/infographic/
EXPOSE 8080
CMD ["/csra-server"]
