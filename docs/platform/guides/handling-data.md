---
sidebar_position: 4
---

# Saving and querying data
TODO: add something about service databases
If you want to save some data to a database, you need to define a model for this data.
We use dataclasses (specifically the Pydantic framework) to define these models.

For example, you could define a simple Model like this:
```python
class User(DBModel):
    id: str
    name: str
    isRegistered: bool = False
    numTimesLoggedIn: int = 0
```
When using the model, the values of fields will be validated according to the specified type-hints, so they are required.
Fields can have defaults if unspecified (like `isRegistered` and `numTimesLoggedIn` in our example).
For more information about possible field types, see [Field Types](https://pydantic-docs.helpmanual.io/usage/types/).

Keep in mind that every model needs to have a single primary key field, that needs to be unique. By default, this field
is `id`, and if no such field exists, and you didn't override the `get_primary_field` function, an exception will be thrown.

You can create a new user in the database like this:
```python
User(id='user1', name='Mind Smith', numTimesLoggedIn=1).create()
```

To fetch a single user you can use `get`:
```python
User.get(id='user1')
```

To query multiple users use `filter`:
```python
User.filter(numTimesLoggedIn=0)
```
This returns an iterator. You can wrap it in `list()` to fetch all results at once.

There are other useful methods like `count`, `distinct`, `all`, `exists`, and others.

If you want to update an object, you have two options:
```python
user = User.get(id='user1')

# Option 1
user.update(numTimesLoggedIn=2)

# Option 2
user.numTimesLoggedIn = 2
user.save()
```
Depending on the complexity of the update, one or the other may be preferred.

Finally, to delete an object, just use `delete`:
```python
user = User.get(id='user1')
user.delete()              # if you have an instance
```