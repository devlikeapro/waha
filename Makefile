build:
	docker build . -t allburov/whatsapp-http-api

run:
	docker run -it -v `pwd`/tokens:/app/tokens -p 127.0.0.1:3000:3000/tcp allburov/whatsapp-http-api

push:
	docker push allburov/whatsapp-http-api
