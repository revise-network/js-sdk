"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Revise = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const constants_1 = require("./constants");
//BASE URL for all the axios connections
const BASE_URL = constants_1.URLS.BASE_URL;
//Create Headers for all the axios request
const getHeaders = ({ token }) => {
    if (token)
        return {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
    else
        throw { statusCode: 401, message: constants_1.ERRORS.TOKEN.NOT_FOUND };
};
//Create Custom Error Messages
const generateError = (error) => {
    let { code, response } = error;
    let status = (response === null || response === void 0 ? void 0 : response.status) || code || "TRY_AGAIN";
    const err = Object.assign(Object.assign({}, constants_1.ERRORS[status]), { code: Number(constants_1.ERRORS[status].code) });
    return err;
};
const fetchCollectionsAPI = async ({ token, perPage, currentPageNumber, }) => {
    try {
        let requestUrl = `${BASE_URL}/collections`;
        //currentPageNumber => pageNumber must starts form 1, Default 0
        //perPage => Default perPage is always 10
        requestUrl += `?perPage=${perPage || 10}&pageNumber=${currentPageNumber || 1}`;
        const { data } = await axios_1.default.get(requestUrl, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const fetchCollectionAPI = async ({ token, collectionId }) => {
    try {
        const { data } = await axios_1.default.get(`${BASE_URL}/collections/${collectionId}`, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const addCollectionAPI = async ({ token, info }) => {
    try {
        const { data } = await axios_1.default.post(`${BASE_URL}/collections`, {
            collectionName: info.name,
            collectionURI: info.uri,
        }, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const addNFTAPI = async ({ token, collectionId, info, }) => {
    try {
        const tokenObj = {
            tokenId: info.tokenId,
            name: info.name,
            image: info.image,
            description: info.description,
            metaData: info.metaData,
        };
        if (collectionId) {
            const { data } = await axios_1.default.post(`${BASE_URL}/collections/${collectionId}/nfts`, tokenObj, getHeaders({ token }));
            return data;
        }
        const { data } = await axios_1.default.post(`${BASE_URL}/nfts/addnft`, tokenObj, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const updateNFTAPI = async ({ token, nftId, info }) => {
    try {
        const { data } = await axios_1.default.put(`${BASE_URL}/nfts/${nftId}`, {
            tokenId: info.tokenId,
            name: info.name,
            image: info.image,
            description: info.description,
            metaData: info.metaData,
        }, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const fetchCollectionNFTsAPI = async ({ token, collectionId }) => {
    try {
        const { data } = await axios_1.default.get(`${BASE_URL}/collections/${collectionId}/nfts`, getHeaders({ token }));
        return data.map((nft) => {
            try {
                const nftEntity = Object.assign(Object.assign({}, nft), { metaData: JSON.parse(nft.metaData) });
                if (nftEntity.id) {
                    return Object.assign(Object.assign({}, nftEntity), { message: "ID exists" });
                }
                return nftEntity;
            }
            catch (error) {
                const nftEntity = Object.assign(Object.assign({}, nft), { metaData: [] });
                return nftEntity;
            }
        });
    }
    catch (error) {
        throw generateError(error);
    }
};
const fetchNFTsAPI = async ({ token, perPage, currentPageNumber, }) => {
    try {
        let requestUrl = `${BASE_URL}/nfts`;
        //currentPageNumber => pageNumber must starts form 1, Default 0
        //perPage => Default perPage is always 10
        requestUrl += `?perPage=${perPage || 10}&pageNumber=${currentPageNumber || 1}`;
        const { data } = await axios_1.default.get(requestUrl, getHeaders({ token }));
        return data.map((nft) => {
            try {
                const nftEntity = Object.assign(Object.assign({}, nft), { metaData: JSON.parse(nft.metaData) });
                if (nftEntity.id) {
                    return Object.assign(Object.assign({}, nftEntity), { message: "ID exists" });
                }
                return nftEntity;
            }
            catch (error) {
                const nftEntity = Object.assign(Object.assign({}, nft), { metaData: [] });
                return nftEntity;
            }
        });
    }
    catch (error) {
        throw generateError(error);
    }
};
const fetchNFTAPI = async ({ token, nftId }) => {
    try {
        const { data } = await axios_1.default.get(`${BASE_URL}/nfts/${nftId}`, getHeaders({ token }));
        try {
            data.metaData = JSON.parse(data.metaData);
        }
        catch (error) {
            data.metaData = {};
        }
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
const fetchRevisionsAPI = async ({ token, nftId }) => {
    try {
        const { data } = await axios_1.default.get(`${BASE_URL}/nfts/${nftId}/revisions`, getHeaders({ token }));
        try {
            data.metaData = JSON.parse(data.metaData);
            data.revisions = data.revisions.map((rev) => {
                try {
                    rev.metaData = JSON.parse(rev.metaData);
                }
                catch (error) {
                    rev.metaData = [];
                }
                return rev;
            });
            return data;
        }
        catch (error) {
            throw {
                response: { data: { code: "INVMD", message: "Invalid metadata" } },
            };
        }
    }
    catch (error) {
        throw generateError(error);
    }
};
const deleteNFTAPI = async ({ token, tokenId }) => {
    try {
        const { data } = await axios_1.default.delete(`${BASE_URL}/nfts/${tokenId}`, getHeaders({ token }));
        return data;
    }
    catch (error) {
        throw generateError(error);
    }
};
class NFTObj {
    constructor({ auth, nft }) {
        this.auth = auth;
        this.nft = nft;
    }
    metaDataAsMap() {
        return this.nft.metaData.reduce((newObj, cur) => {
            if (!newObj)
                newObj = {};
            newObj[Object.keys(cur)[0]] = cur[Object.keys(cur)[0]];
            return newObj;
        });
    }
    setMetaData(obj) {
        const d = Object.keys(obj).map((key) => {
            const newObj = {};
            newObj[key] = obj[key];
            return newObj;
        });
        this.nft.metaData = d;
    }
    setProperty(key, value) {
        const metaData = this.metaDataAsMap();
        // let isNewProperty = true;
        // this.nft.metaData = this.nft.metaData.map((attr: Attribute) => {
        //   const temp = {...attr};
        //   if (Object.keys(temp)[0] === key) {
        //     isNewProperty = false;
        //     temp[key] = value;
        //   }
        //   return temp;
        // })
        // if (isNewProperty) {
        //   const o = {};
        //   o[key] = value;
        //   this.nft.metaData.push(o);
        // }
        metaData[key] = value;
        this.setMetaData(metaData);
        return this;
    }
    deleteProperty(key) {
        this.nft.metaData = this.nft.metaData.filter((attr) => Object.keys(attr)[0] !== key);
        return this;
    }
    setName(name) {
        this.nft.name = name;
        return this;
    }
    setImage(image) {
        this.nft.image = image;
        return this;
    }
    setTokenId(tokenId) {
        this.nft.tokenId = tokenId;
        return this;
    }
    setDescription(description) {
        this.nft.description = description;
        return this;
    }
    save() {
        return updateNFTAPI({
            token: this.auth,
            nftId: this.nft.id,
            info: {
                tokenId: this.nft.tokenId,
                name: this.nft.name,
                image: this.nft.image,
                description: this.nft.description,
                metaData: this.nft.metaData,
            },
        });
    }
    // export() {
    //   return "ipfs://...";
    // }
    async revisions() {
        return (await fetchRevisionsAPI({ token: this.auth, nftId: this.nft.id }))
            .revisions;
    }
    async revisionsLink() {
        return `https://revise.link/revision/${this.nft.id}`;
    }
}
//Exported for Usage of SDK
class Revise {
    constructor(values) {
        this.fetchCollections = async () => {
            try {
                return await fetchCollectionsAPI({ token: this.auth });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.fetchCollection = async (collectionId) => {
            try {
                return await fetchCollectionAPI({ token: this.auth, collectionId });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.addCollection = async ({ name, uri }) => {
            try {
                return await addCollectionAPI({ token: this.auth, info: { name, uri } });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.addNFT = async (tokenData, properties, collectionId) => {
            try {
                const { tokenId, name, image, description } = tokenData;
                const info = {
                    tokenId,
                    name,
                    image,
                    description: description || "",
                    metaData: properties,
                };
                if (collectionId) {
                    return await addNFTAPI({ token: this.auth, collectionId, info });
                }
                else
                    return await addNFTAPI({ token: this.auth, info });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.updateNFT = async (nftId) => {
            try {
                return await this.nft(await this.fetchNFT(nftId));
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.nft = async (nft) => {
            try {
                return new NFTObj({ auth: this.auth, nft });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.fetchNFTs = async (collectionId) => {
            try {
                if (collectionId)
                    return await fetchCollectionNFTsAPI({ token: this.auth, collectionId });
                else
                    return await fetchNFTsAPI({ token: this.auth });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.fetchNFT = async (nftId) => {
            try {
                return await fetchNFTAPI({ token: this.auth, nftId });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.deleteNFT = async (nftId) => {
            try {
                return await deleteNFTAPI({ token: this.auth, tokenId: nftId });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.fetchRevisions = async (nftId) => {
            try {
                return await fetchRevisionsAPI({ token: this.auth, nftId });
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        this.every = async (durationString) => {
            try {
                return new Automation(new Duration(durationString));
            }
            catch (error) {
                throw Object.assign({}, error);
            }
        };
        if (!values)
            throw constants_1.ERRORS.TOKEN.NOT_INITIALIZED;
        const { auth } = values;
        this.auth = auth;
    }
}
exports.Revise = Revise;
class Automation {
    constructor(duration) {
        this.duration = duration;
    }
    listenTo(api) {
        if (typeof api !== "string" && typeof api !== "function") {
            throw new Error("invalid API source shared");
        }
        if (typeof api === "string") {
            this.apiResolver = async () => (await axios_1.default.get(api)).data;
        }
        if (typeof api === "function") {
            this.apiResolver = api;
        }
        return this;
    }
    async start(cb) {
        const data = await this.apiResolver();
        cb(data);
        setTimeout(() => {
            this.start(cb);
        }, this.duration.getMiliseconds());
    }
}
class Duration {
    constructor(durationString) {
        this.durationString = durationString;
    }
    getMiliseconds() {
        try {
            if (this.durationString.toLowerCase().includes("s")) {
                const data = this.durationString.toLowerCase().split("m")[0];
                return parseInt(data) * 1000;
            }
            if (this.durationString.toLowerCase().includes("m")) {
                const data = this.durationString.toLowerCase().split("m")[0];
                return parseInt(data) * 60000;
            }
            if (this.durationString.toLowerCase().includes("h")) {
                const data = this.durationString.toLowerCase().split("m")[0];
                return parseInt(data) * 3600000;
            }
        }
        catch (error) {
            throw new Error("Invalid time format passed");
        }
    }
}
//# sourceMappingURL=index.js.map