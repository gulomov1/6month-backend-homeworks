# Week 5 Uy Vazifasi — Simple Blog Platform

## MongoDB Collections

![Collections](assets/collections.png)

---

## 1. users Collection

**Nima saqlaydi:** Foydalanuvchilar (maqola yozuvchilar va o'quvchilar)

**Fields:**
```js
{
  _id: ObjectId,
  fullName: String,
  email: String,
  password: String,
  role: "author" | "reader" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

**ObjectId references:** Yo'q (boshqa collectionlar shu ga reference qiladi)

**Indexes:**
```js
db.users.createIndex({ email: 1 }, { unique: true })
```

**Embedded:** Hech narsa embed qilinmaydi

**Referenced:** `posts`, `comments`, `likes` collectionlari `userId` orqali shu ga bog'lanadi

![Users](assets/users.png)

---

## 2. categories Collection

**Nima saqlaydi:** Maqola kategoriyalari

**Fields:**
```js
{
  _id: ObjectId,
  name: String,
  slug: String,
  createdAt: Date
}
```

**ObjectId references:** Yo'q

**Indexes:**
```js
db.categories.createIndex({ slug: 1 }, { unique: true })
```

**Embedded:** Hech narsa

**Referenced:** `posts` collection `categoryId` orqali shu ga bog'lanadi

![Categories](assets/categories.png)

---

## 3. posts Collection

**Nima saqlaydi:** Blog maqolalari

**Fields:**
```js
{
  _id: ObjectId,
  title: String,
  content: String,
  authorId: ObjectId,    // → users
  categoryId: ObjectId,  // → categories
  tags: Array,
  isPublished: Boolean,
  viewCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

**ObjectId references:**
- `authorId` → users
- `categoryId` → categories

**Indexes:**
```js
db.posts.createIndex({ authorId: 1 })
db.posts.createIndex({ categoryId: 1 })
```

**Embedded:** `tags` massivi — kichik va faqat shu postga tegishli

**Referenced:** `authorId`, `categoryId` — boshqa collectionlarda ham ishlatiladi

![Posts](assets/posts.png)

---

## 4. comments Collection

**Nima saqlaydi:** Postlarga yozilgan izohlar

**Fields:**
```js
{
  _id: ObjectId,
  postId: ObjectId,    // → posts
  authorId: ObjectId,  // → users
  text: String,
  createdAt: Date
}
```

**ObjectId references:**
- `postId` → posts
- `authorId` → users

**Indexes:**
```js
db.comments.createIndex({ postId: 1 })
```

**Embedded:** Hech narsa

**Referenced:** Hamma narsa referenced — comments alohida collection da saqlanadi

![Comments](assets/comments.png)

---

## 5. likes Collection

**Nima saqlaydi:** Kim qaysi postga like bosgan

**Fields:**
```js
{
  _id: ObjectId,
  postId: ObjectId,  // → posts
  userId: ObjectId,  // → users
  createdAt: Date
}
```

**ObjectId references:**
- `postId` → posts
- `userId` → users

**Indexes:**
```js
db.likes.createIndex({ postId: 1, userId: 1 }, { unique: true })
// Bir user bir postga faqat 1 marta like bosa oladi
```

**Embedded:** Hech narsa

**Referenced:** Hamma narsa referenced

![Likes](assets/likes.png)

---

## 10-savol Javobi

**Savol:** Comments ni post ichiga embed qilish kerakmi yoki alohida collection?

**Javob:**

Kichik bloglar uchun embed qilish mumkin.

Lekin haqiqiy platformalar uchun **alohida `comments` collection** to'g'ri tanlov, chunki:

1. Bir post da minglab comment bo'lishi mumkin
2. Hamma commentlarni har safar post bilan birga yuklab olish keraksiz
3. MongoDB document ning maksimal o'lchami 16MB — embed qilsak chegaraga yetib qolishi mumkin
4. Commentni alohida o'chirish, tahrirlash — Referenced da oson

**Xulosa:** Ko'p va mustaqil o'zgarishi mumkin bo'lgan ma'lumot → **Referenced (alohida collection)**.
