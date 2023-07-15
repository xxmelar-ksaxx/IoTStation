export interface ListItemProps{
    // id:string, //list index
    SSEConnection:boolean,
    json:{
        hw_id:string,
        label:string,
        HW_updates:{
            m?: {
                i?:any,
                c?:any
          },
            s?: {
                i?: any,
                c?: any
          },
            i?: {
              connected?: any
          }
        },
        last_update?:string
      }
}

export default ListItemProps