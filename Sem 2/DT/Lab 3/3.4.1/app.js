var app = new Vue({
    el: '#hamming-encoder',
    data: {
        dataBits: [],
        status: '',
        numberOfDataBits: 4
    },
    created: function () {
        this.initDataBits(4);
    },
    methods: {
        initDataBits: function(){
            this.dataBits=[];

            for(var i = 0; i < this.numberOfDataBits; i++){
                var bit = { data: null };
                this.dataBits.push(bit);
            }
        },
        send: function () {
            if (this.validate(this.dataBits) === true){
                var encodedMessage = this.encode(this.dataBits);

                return axios.put("http://localhost:3000/message", {bits: encodedMessage}).then(
                    response => (this.status = response.data)
                );
            } else {
                this.status = 'Invalid input. Please use 0 or 1 as data bit values';
            }
        },
        encode: function(bits){
            if (this.numberOfDataBits == 4) {
                var c4 = this.parity(parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data));
                var c2 = this.parity(parseInt(bits[0].data) + parseInt(bits[2].data) + parseInt(bits[3].data));
                var c1 = this.parity(parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[3].data));
                var c0 = this.parity(parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + c1 + c2 + c4);
                console.log("Control bits: " + c0 + "," + c1 + "," + c2 + "," + c4);
                return [c0, c1, c2, parseInt(bits[0].data), c4, parseInt(bits[1].data), parseInt(bits[2].data), parseInt(bits[3].data)];
            } else if(this.numberOfDataBits == 8){
                var c8 = this.parity(parseInt(bits[4].data) + parseInt(bits[5].data) + parseInt(bits[6].data) + parseInt(bits[7].data));
                var c4 = this.parity(parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data));
                var c2 = this.parity(parseInt(bits[0].data) + parseInt(bits[2].data) + parseInt(bits[3].data));
                var c1 = this.parity(parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[3].data));
                var c0 = this.parity(parseInt(bits[0].data) + parseInt(bits[1].data) + parseInt(bits[2].data) + parseInt(bits[3].data) + c1 + c2 + c4);
                console.log("Control bits: " + c0 + "," + c1 + "," + c2 + "," + c4 + "," + c8);
                return [c0, c1, c2, parseInt(bits[0].data), c4, parseInt(bits[1].data), parseInt(bits[2].data), parseInt(bits[3].data), c8,
              parseInt(bits[4].data), parseInt(bits[5].data), parseInt(bits[6].data), parseInt(bits[7].data)];
            }
        },
        parity: function(number){
            return number % 2;
        },
        validate: function(bits){
            for(var i = 0; i < bits.length; i++){
                if (this.validateBit(bits[i].data) === false)
                return false;
            }
            return true;
        },
        validateBit: function(character){
            if (character === null) return false;
            return (parseInt(character) === 0 ||
            parseInt(character) === 1);
        }
    }
})
