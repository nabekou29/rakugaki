interface Entity {
  id: string;
}

/** リモコン */
export interface Remocon extends Entity {
  name: string;
}

/** 信号 */
export interface Signal extends Entity {
  name: string;
  remoconId: string;
}
