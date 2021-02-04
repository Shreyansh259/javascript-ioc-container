class Container {
  constructor() {
    this._services = new Map();
    this._singletons = new Map();
    this.circularDependency = new Set();
  }

  register(name, definition, dependencies) {
    this._services.set(name, {
      definition: definition,
      dependencies: dependencies,
    });
  }

  singleton(name, definition, dependencies) {
    this._services.set(name, {
      definition: definition,
      dependencies: dependencies,
      singleton: true,
    });
  }

  get(name) {
    if (this.circularDependency.has(name)) {
      throw `Circular dependency has been found for ${name} service.`;
    }
    if (this._services.has(name)) {
      const serviceInstance = this._services.get(name);
      if (this._isClass(serviceInstance.definition)) {
        if (serviceInstance.singleton) {
          const singletonInstance = this._singletons.get(name);
          if (singletonInstance) {
            return singletonInstance;
          } else {
            this.circularDependency.add(name);
            const newSingletonInstance = this._createInstance(serviceInstance);
            this.circularDependency.delete(name);
            this._singletons.set(name, newSingletonInstance);
            return newSingletonInstance;
          }
        }
        this.circularDependency.add(name);
        const instance = this._createInstance(serviceInstance);
        this.circularDependency.delete(name);
        return instance;
      } else {
        return serviceInstance.definition;
      }
    } else {
      throw `The service ${name} hasn't been registered with the IOC Container`;
    }
  }

  _getResolvedDependencies(service) {
    let classDependencies = [];
    if (service.dependencies) {
      classDependencies = service.dependencies.map((dep) => {
        return this.get(dep);
      });
    }
    return classDependencies;
  }

  _createInstance(service) {
    return new service.definition(...this._getResolvedDependencies(service));
  }

  _isClass(definition) {
    return typeof definition === "function";
  }
}
export default Container;
