import CardModel from '../models/CardModel'
import {SERVER_RETURN,TCard} from '../types/index'

export default class CardService {
  private cardModel = CardModel
  public async getUserCards(userId:number):Promise<SERVER_RETURN>{
    const userCards = await this.cardModel.findAll({where:{userId},attributes: { exclude: ['user_id','userId'] }})
    if(!userId || userCards.length <1){
      return {type:404,message:'dont have cards'}
    }
    return{type:null,message:userCards}
  }
  public async removeCard(userId:number,cardId:number):Promise<SERVER_RETURN>{
      const card = await this.cardModel.findOne({where:{userId,id:cardId}})
      if(!card){
        return{type:403,message:'it is not possible to remove this card'}
      }
      await this.cardModel.destroy({where:{userId,id:cardId}});
      return await this.getUserCards(userId)
  }
  public async addCard(userId:number,card:TCard):Promise<SERVER_RETURN>{
    const newCardData = {
      ...card,
      userId,
    }
    const newCard = await this.cardModel.build(newCardData)
    await newCard.save()
    return {type:null,message:newCard}
  }
}