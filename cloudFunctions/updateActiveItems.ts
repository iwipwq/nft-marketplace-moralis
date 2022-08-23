
export {}

console.log("서버에 스크립트 업로드");

interface Logger {
    info<T,R>(log:T):R;
}

// interface InnerObject {
//     get<T,R>(objectName:T): R;
//     // [props:string]: any;
// }

interface RequestObject {
    object: ObjectAttribute;
}

interface Cloud {
    afterSave<T>(events:{ new (): T } | string, callback:(request:RequestObject) => Promise<void> | void): void;
    getLogger():Logger;
}

interface ObjectAttribute {
    get<T,R>(objectName:T): R;
    set<T,U,R>(attr:T,value:U):R;
    save<T,U,R>(attrs?:T, options?:U): Promise<R>;
    destroy<O>(options?: O): Promise<this>;
    [key:string]:any;
}

interface ObjectStatic {
    extend<T>(className: string | { className: string }, protoProps?: any, classProps?: any): {new (...args: T[]):ObjectAttribute};
}

interface NewQueryObject {
    equalTo<K,R>(key: K,value:RequestObject):R
    first():Promise<ObjectAttribute>
}

interface Moralis {
    Cloud: Cloud;
    Object: ObjectStatic;
    Query: new<T> (queriedTable:{new (...args: T[]):ObjectAttribute}) => NewQueryObject;

}

declare global {
    var Moralis: Moralis;
}

Moralis.Cloud.afterSave("ItemListed",async (request:RequestObject) => {
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

Moralis.Cloud.afterSave("ItemCancled",async (request:RequestObject) => {
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
            logger.info(`판매가 취소되어 등록된 ${request.object.get("tokenId")} 를 ${request.object.get("address")}으 아이템 목록에서 제거하였습니다.`);
            await canceledItem.destroy()
        } else {
            logger.info(`주소:${request.object.get("address")} 에서 토큰아이디가 ${request.object.get("tokenId")} 인 아이템을 찾을 수 없습니다.`)
        }
    }    
})


