import { Store } from '../../../drafter/src/store';

export default Store ('VAT', {
  state: {
    VATRate: 0.18,
    VATAmount: 0,
    VATCode: 'V18'
  },
  methods: {
    setVATAmount(value){
      this.VATAmount = value;
    },
    setVATRate(value){
      this.VATRate = value;
    }
  }
});
  // class VAT {
  //   constructor(){
  //     this.VATRate = 0;
  //     this.VATAmount = 0;
  //   }
  //   setVATAmount(value){
  //     this.VATAmount = value;
  //   }
  //   setVATRate(value){
  //     this.VATRate = value;
  //   }
  // }

// )
