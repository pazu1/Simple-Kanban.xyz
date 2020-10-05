import CryptoAES from "crypto-js/aes";
import CryptoENC from "crypto-js/enc-utf8";
import CryptoCore from "crypto-js";

class Encryption {
    constructor() {
        const instance = this.constructor.instance;
        if (instance) {
            return instance;
        }

        this.instance = this;
        this.key = null;
    }

    generateKey() {
        return CryptoCore.lib.WordArray.random(128 / 8).toString();
    }

    encrypt(text) {
        return CryptoAES.encrypt(text, this.key).toString();
    }

    decrypt(ciphertext) {
        let decrypted = CryptoAES.decrypt(ciphertext.toString(), this.key);
        return decrypted.toString(CryptoENC);
    }
}

export default Encryption;
