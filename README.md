# IoC Container

This script is an example of a basic IoC container in JavaScript.

# Features
*  Support for declaring singletons
*  Support for circular dependency
*  Support for cross-cutting actions over registered instances 
*  Inject your instances where you need them
*  Easy integration testing with mocked instances support

Register classes

```javascript

const container = new Container()

container.register('userDetails', {name:'John Doe'})
container.register('user', User, ['userDetails']) 
container.singleton('profile', Profile, ['userDetails'])

```

Retrieve classes from container


```javascript

container.get('userDetails')
container.get('user') 
container.get('profile')

```

## Run test

```
npm install
npm test
```