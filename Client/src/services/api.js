const API_URL = 'http://localhost:3005';
// console.log('a',API_URL)

export const register =(data)=>{
    return fetch(`${API_URL}/user/register`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    })
}

export const login =(data)=>{
    return fetch(`${API_URL}/user/login`,{
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
       body:JSON.stringify(data)
    })
}