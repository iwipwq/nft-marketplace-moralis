Moralis.Cloud.afterSave("ItemListed",async (request) => {
    const confrimed = request.object.get("confirmed");
    const logger = Moralis.Cloud.getLogger();
    logger.info("Tx 컨펌 감시중 ...");
    if(confrimed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const activeItem = new ActiveItem()
        activeItem.set("marketpalceAddress", request.object.get("address"))
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
    logger.info(`Marketplace | Object ${request.object}`);
    if(confirmed) {
        const ActiveItem = Moralis.Object.extend("ActiveItem");
        const query = new Moralis.Query(ActiveItem);
        logger.info(query);
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
