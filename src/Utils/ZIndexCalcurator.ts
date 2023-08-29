
export default class ZIndexCalcurator{
  constructor(
    //文字列じゃなくて、抽象化したい。 equalsでもできるようにしたい。
    readonly ids: string[],
    readonly topId: string | undefined = undefined,
    //readonly bottomId: string | undefined //あとで:
  ){
    //後ほど上が普通
  }

  setTop(id:string | undefined){
    if(id === undefined){
      return new ZIndexCalcurator(this.ids, undefined);
    }

    if(!this.ids.includes(id)){
      throw new Error(`#${id}はid一覧に含まれていないため、トップに設定できません`);
    }

    return new ZIndexCalcurator(this.ids, id);
  }

  getZIndex(id: string){
    if(id === this.topId){
      return this.maxZIndex + 1; 
    }

    return this.ids.indexOf(id);
  }

  get maxZIndex(){
    return this.ids.length;
  }

}