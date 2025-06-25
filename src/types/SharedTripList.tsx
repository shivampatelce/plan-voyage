export interface AddListReq {
  tripId: string;
  listTitle: string;
  userId: string;
}

export interface AddItemReq {
  listId: string;
  listItem: string;
  addedBy: string;
}
