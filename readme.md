### User schema
 - username: string
 - email: string
 - password: string
 - createdAt: date
 - updatedAt: date



### note schema

- title: String,
- body: String,
- author: user's id
- createdAt: date

### Shared note schema ( join table )
- sharedBy: author's id
- sharedTo: reciever's id
- noteId: reciever's id

---

```

model User {
  id          Int          @id @default(autoincrement())
  name        String
  createdNotes Note[]      // Notes created by the user
  sharedNotes SharedNote[] // Notes shared with the user
}

model Note {
  id          Int          @id @default(autoincrement())
  title       String
  content     String
  creator     User         @relation(fields: [creatorId], references: [id])
  creatorId   Int
  sharedNotes SharedNote[] // Notes shared with other users
}

model SharedNote {
  id          Int    @id @default(autoincrement())
  note        Note   @relation(fields: [noteId], references: [id])
  noteId      Int
  sender      User   @relation("SharedNotesToUser", fields: [senderId], references: [id])
  senderId    Int
  receiver    User   @relation("SharedNotesToUser", fields: [receiverId], references: [id])
  receiverId  Int
}

```

