"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
console.log("서버에 스크립트 업로드");
Moralis.Cloud.afterSave("ItemListed", function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var confrimed, logger, ActiveItem, activeItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                confrimed = request.object.get("confirmed");
                logger = Moralis.Cloud.getLogger();
                logger.info("Tx 컨펌 감시중 ...");
                if (!confrimed) return [3 /*break*/, 2];
                ActiveItem = Moralis.Object.extend("ActiveItem");
                activeItem = new ActiveItem();
                activeItem.set("marketpalceAddress", request.object.get("address"));
                activeItem.set("nftAddress", request.object.get("nftAddress"));
                activeItem.set("price", request.object.get("price"));
                activeItem.set("tokenId", request.object.get("tokenId"));
                activeItem.set("seller", request.object.get("seller"));
                logger.info("\uD14C\uC774\uBE14 \uCD94\uAC00\uB428 => address: ".concat(request.object.get("address"), ", tokenId: ").concat(request.object.get("tokenId")));
                logger.info("\uC800\uC7A5\uC911\uC785\uB2C8\uB2E4 ... ");
                return [4 /*yield*/, activeItem.save()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); });
Moralis.Cloud.afterSave("ItemCancled", function (request) { return __awaiter(void 0, void 0, void 0, function () {
    var confirmed, logger, ActiveItem, query, canceledItem;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                confirmed = request.object.get("confirmed");
                logger = Moralis.Cloud.getLogger();
                logger.info("Marketplace | Object ".concat(request.object));
                if (!confirmed) return [3 /*break*/, 4];
                ActiveItem = Moralis.Object.extend("ActiveItem");
                query = new Moralis.Query(ActiveItem);
                query.equalTo("marketplaceAddress", request.object.get("address"));
                query.equalTo("nftAddress", request.object.get("nftAddress"));
                query.equalTo("tokenId", request.object.get("tokenId"));
                logger.info("Marketplace | \uCFFC\uB9AC: ".concat(query));
                return [4 /*yield*/, query.first()];
            case 1:
                canceledItem = _a.sent();
                logger.info("Marketplace | \uCDE8\uC18C\uB41C \uBB3C\uD488: ".concat(canceledItem));
                if (!canceledItem) return [3 /*break*/, 3];
                logger.info("\uD310\uB9E4\uAC00 \uCDE8\uC18C\uB418\uC5B4 \uB4F1\uB85D\uB41C ".concat(request.object.get("tokenId"), " \uB97C ").concat(request.object.get("address"), "\uC73C \uC544\uC774\uD15C \uBAA9\uB85D\uC5D0\uC11C \uC81C\uAC70\uD558\uC600\uC2B5\uB2C8\uB2E4."));
                return [4 /*yield*/, canceledItem.destroy()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                logger.info("\uC8FC\uC18C:".concat(request.object.get("address"), " \uC5D0\uC11C \uD1A0\uD070\uC544\uC774\uB514\uAC00 ").concat(request.object.get("tokenId"), " \uC778 \uC544\uC774\uD15C\uC744 \uCC3E\uC744 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."));
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
