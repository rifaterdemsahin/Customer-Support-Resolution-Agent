FROM golang:1.24-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY main.go .
RUN CGO_ENABLED=0 GOOS=linux go build -o /csra-server .

FROM alpine:3.21
RUN apk --no-cache add ca-certificates
COPY --from=builder /csra-server /csra-server
EXPOSE 8080
CMD ["/csra-server"]
