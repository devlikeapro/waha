build-all: build-plus build-chrome build-gows build-noweb

build:
	docker build . -t devlikeapro/waha

build-plus:
	docker build . -t devlikeapro/waha-plus

build-chrome:
	docker build . -t devlikeapro/waha-plus:chrome --build-arg USE_BROWSER=chrome

build-noweb:
	docker build . -t devlikeapro/waha-plus:noweb --build-arg USE_BROWSER=none --build-arg WHATSAPP_DEFAULT_ENGINE=NOWEB

build-gows:
	docker build . -t devlikeapro/waha-plus:gows --build-arg USE_BROWSER=none --build-arg WHATSAPP_DEFAULT_ENGINE=GOWS

build-ssh:
	# check IMAGE provided
	@[ "${IMAGE}" ]  || ( echo "Add APP: make build-ssh image=devlikeapro/waha"; exit 1 );
	eval $(ssh-agent) && \
	ssh-add ~/.ssh/id_rsa && \
	docker buildx build --ssh default=${SSH_AUTH_SOCK} . -t ${IMAGE} --build-arg USE_BROWSER=none

stop:
	docker stop waha

clean: stop
	sudo rm -rf .sessions

push:
	docker push devlikeapro/waha

for-swagger:
	export WHATSAPP_SWAGGER_CONFIG_ADVANCED=true && export WHATSAPP_SWAGGER_PASSWORD=666 && yarn start

up-noweb:
	yarn up @adiwajshing/baileys@github:devlikeapro/Baileys#fork-master-2026-01-25

up-noweb-libsignal:
	yarn up libsignal@github:devlikeapro/libsignal-node#fork-master

up-webjs:
	yarn up whatsapp-web.js@github:devlikeapro/whatsapp-web.js#fork-main-2025-12-17

start-proxy:
	docker run --rm -d --name squid-container -e TZ=UTC -p 3128:3128 ubuntu/squid:5.2-22.04_beta

proto-gows:
	node scripts/gows-proto.js build --dir ../gows/proto

gows:
	cd ../gows && \
	export PATH=${HOME}/go/bin:${PATH} && \
	make all

copy-dashboard:
	cd ../waha-hub/ui && \
	make copy-waha

