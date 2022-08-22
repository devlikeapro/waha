build:
	docker build . -t allburov/whatsapp-http-api

run:
	docker run --rm -v `pwd`/tokens:/app/tokens -p 127.0.0.1:3000:3000/tcp --name whatsapp-http-api allburov/whatsapp-http-api

push:
	docker push allburov/whatsapp-http-api
