build:
	docker build . -t devlikeapro/whatsapp-http-api

run:
	docker run \
		--rm -d \
		-p 127.0.0.1:3000:3000/tcp \
		-v `pwd`/.sessions:/app/.sessions \
		-e WHATSAPP_HOOK_URL=https://httpbin.org/post \
		-e WHATSAPP_HOOK_EVENTS=* \
		--name whatsapp-http-api devlikeapro/whatsapp-http-api

stop:
	docker stop whatsapp-http-api

clean: stop
	sudo rm -rf .sessions

push:
	docker push devlikeapro/whatsapp-http-api

update-swagger:
	wget http://localhost:3000/-json -O ./docs/site/static/swagger/openapi.json
