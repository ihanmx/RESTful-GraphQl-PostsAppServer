import { buildSchema } from "graphql";

const schema = buildSchema(`


    type Post{
        _id:ID!,
        title:String!
        content:String!
        imageUrl:String!
        creator:User!
        createdAt:String!
        updatedAt:String!

        }



    type User{
        _id:ID!,
        name:String!
        email:String!
        password:String
        status:String
        posts:[Post!]}

    input UserData{
        email:String!
        name:String!
        password:String
    }


    input PostData{
        title:String!
        content:String!
        imageUrl:String!
    
    }

    type PostsData{
        posts:[Post!]!
        totalPosts:Int!

    
    
    
    }

    type AuthData{
        token:String
        userId:String
    
    }

    type RootQuery{
        login(email:String!,password:String!):AuthData!
        posts(page:Int!):PostsData!
        post(id:ID!):Post!
        status:String!

    }



   
    type RootMutation {
        createUser(userInput:UserData):User!
        createPost(postInput:PostData):Post!
        updatePost(id:ID!,postInput:PostData):Post!
        deletePost(id:ID!):Boolean!
        updateStatus(status:String!):String!
    }

    schema {
        mutation:RootMutation
        query:RootQuery
    }
    
    
    
    `);
export default schema;
