export async function getListItems(username: string, id: number) {
  const response = await fetch(`https://keeptrackofmygames.com/api/lists/${username}/${id}/group/?sortby=0&filterby=&filtermatch=and&preview=false`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  })
  if (!response.ok) {
    return [];
  }
  return await response.json();
}
