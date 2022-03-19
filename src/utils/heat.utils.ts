import {HeatUser} from '../types/heat.types';
const cachedUsers: { [key: string]: HeatUser } = {};
export const getUserName = async (id: string): Promise<string | HeatUser> => {
  if(typeof cachedUsers[id] !== 'undefined'){
    return cachedUsers[id];
  }
  if (id.startsWith("A")) return "Anonyme";
  else if (id.startsWith("U")) return "Inconnu";
  else {
    const result: HeatUser = await fetch(`https://heat-api.j38.net/user/${id}`).then(blob => blob.json());
    if (!result) {
      return id
    }
    cachedUsers[id] = result;
    return result;
  }
}