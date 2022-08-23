Moralis.Cloud.afterSave("ItemListed",async (request) => {
    const confrimed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Tx 컨펌 감시중 ...");
    if(confrimed) {
        logger.info("아이템을 찾았습니다.");
        const ActiveItem = Moralis.Object.extend("ActiveItem");

        // 리스트가 업데이트 되어야 할 때, 이미 등록된 ActiveItem을 제거
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("seller",request.object.get("seller"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | query ${query}`);
        const alreadyListedItem = await query.first();

        if(alreadyListedItem) {
            logger.info(`아이템이 이미 존재하고 있기떄문에 기존아이템을 파괴하고 새 아이템 ${request.object.get("objectId")}으로 교체합니다.`)
            await alreadyListedItem.destroy();
            logger.info(`이미 존재하는 ${request.object.get("address")} 에 있는 토큰아이디 ${request.object.get("tokenId")} 아이템을 제거했습니다. `)
        }

        //새 아이템 추가(혹은 기존아이템 삭제후 새 상태로 업데이트)
        const activeItem = new ActiveItem()
        activeItem.set("marketplaceAddress", request.object.get("address"))
        activeItem.set("nftAddress", request.object.get("nftAddress"));
        activeItem.set("price", request.object.get("price"));
        activeItem.set("tokenId", request.object.get("tokenId"));
        activeItem.set("seller", request.object.get("seller"));
        logger.info(`테이블 추가됨 => address: ${request.object.get("address")}, tokenId: ${request.object.get("tokenId")}`)
        logger.info(`저장중입니다 ... `);
        await activeItem.save();
    }
})

Moralis.Cloud.afterSave("ItemCanceled",async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("아이템 등록 취소 이벤트 감지")
    logger.info(`Marketplace | Object ${request.object}`);
    if(confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | 쿼리: ${query}`);
        const canceledItem = await query.first();
        logger.info(`Marketplace | 취소된 물품: ${canceledItem}`);
        if(canceledItem) {
            logger.info(`판매가 취소되어 등록된 ${request.object.get("tokenId")} 를 ${request.object.get("address")} 아이템 목록에서 제거하였습니다.`);
            await canceledItem.destroy()
        } else {
            logger.info(`주소:${request.object.get("address")} 에서 토큰아이디가 ${request.object.get("tokenId")} 인 아이템을 찾을 수 없습니다.`)
        }
    }    
})

Moralis.Cloud.afterSave("ItemBought", async (request) => {
    const confirmed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("아이템 구매 이벤트 수신")
    logger.info(request.object);
    if(confirmed) {
        const activeItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(activeItem);
        query.equalTo("marketplaceAddress", request.object.get("address"));
        query.equalTo("nftAddress", request.object.get("nftAddress"));
        query.equalTo("tokenId", request.object.get("tokenId"));
        logger.info(`Marketplace | query : ${query}`);
        const boughtItem = await query.first();
        logger.info(`Marketplace | 구입한 아이템: ${boughtItem}`);
        if(boughtItem) {
            logger.info(`등록된 ${request.object.get("tokenId")} 아이템이 판매되어 ${request.object.get("address")} 아이템 목록에서 제거하였습니다.`);
            await boughtItem.destroy()
        } else {
            logger.info(`주소:${request.object.get("address")} 에서 토큰아이디가 ${request.object.get("tokenId")} 인 아이템을 찾을 수 없습니다.`)
        }
    }
})