
export {}

console.log("헬로");

interface Logger {
    info<T,R>(log:T):R;
}

interface RequestObject {
    object: { get<T,R>(objectName:T):R}
}

interface Cloud {
    afterSave<T>(events:{ new (): T } | string, callback:(request:RequestObject) => Promise<void> | void): void;
    getLogger():Logger;
}

interface ObjectAttribute {
    set<T,U,R>(attr:T,value:U):R;
    save<T,U,R>(attrs?:T, options?:U): Promise<R>;
}

interface ObjectStatic {
    extend(className: string | { className: string }, protoProps?: any, classProps?: any): {new ():ObjectAttribute};
}

interface Moralis {
    Cloud: Cloud;
    Object: ObjectStatic;
}

declare global {
    var Moralis: Moralis;
}

Moralis.Cloud.afterSave("ItemListed",async (request:RequestObject) => {
    const confrimed = request.object.get("confirmed")
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
