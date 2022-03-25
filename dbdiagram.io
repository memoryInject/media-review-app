//// -- LEVEL 1
//// -- Tables and References
Table user {
  id int [pk, increment] // auto-increment
  email varchar
  created_at timestamp
}

Table user_profile {
  id int [pk, increment] // auto-increment
  user int [ref: > user.id]
  image_url varchar
  company_name varchar
  is_admin boolean
  created_at timestamp
}

Table project {
  id int [pk, increment] // auto-increment
  user int [ref: > user.id]
  project_name varchar
  image_url varchar
  color varchar
  created_at timestamp
}

Table review {
  id int [pk, increment] // auto-increment
  user int [ref: > user.id]
  review_name varchar
  image_url varchar
  project int [ref: > project.id]
  created_at timestamp
}

Table collaborators {
  id int [pk, increment]
  user int [ref: > user.id]
  review int [ref: > review.id]
}

Table asset {
  id int [pk, increment]
  user int [ref: > user.id]
  url varchar
  image_url varchar
}

Table media {
  id int [pk, increment]
  user int [ref: > user.id]
  asset int [ref: > asset.id]
  review int [ref: > review.id]
  parent int [ref: > media.id]
  media_name varchar
  version int
}

Table feedback {
  id int [pk, increment]
  user int [ref: > user.id]
  media int [ref: > media.id]
  parent int [ref: > feedback.id]
  content varchar
  media_time float
  annotation_url varchar
}

Table notification {
  id int [pk, increment]
  user int [ref: > user.id]
  message varchar
  type varchar
  url varchar
  created_at timestamp
}
