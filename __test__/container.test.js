import Container from "../container.js";

describe("test the container", () => {
  it("create container and get instance of class", () => {
    const container = new Container();
    const sample = class Sample {
      constructor() {
        this.sampleValue = 1;
      }
    };
    container.register("sample", sample);
    const sampleInstance = container.get("sample");
    expect(sampleInstance.sampleValue).toBe(1);
  });
  it("when class has dependency", () => {
    const container = new Container();
    const userDetails = {
      firstName: "John",
      lastName: "Doe",
    };
    const user = class User {
      constructor(userObject) {
        this.name = `${userObject.firstName} ${userObject.lastName}`;
      }
    };
    container.register("userDetails", userDetails);
    container.register("user", user, ["userDetails"]);
    const userInstance = container.get("user");
    expect(userInstance.name).toBe("John Doe");
  });
  it("should resolve the singlton dependency", () => {
    const container = new Container();
    const singleton = class Singleton {
      constructor() {
        this.name = "John Doe";
      }
    };
    const user = class User {
      constructor(singleton) {
        this.singleton = singleton;
      }
    };
    container.singleton("singleton", singleton);
    container.register("user", user, ["singleton"]);
    const userInstance = container.get("user");
    userInstance.singleton.name = "Jane Doe";
    expect(userInstance.singleton.name).toBe("Jane Doe");
  });
  it("should resolve the circular dependency", () => {
    const container = new Container();
    const c = class C {
      constructor(user) {
        this.name = user;
      }
    };
    const user = class User {
      constructor(singletonB) {
        this.userName = singletonB;
      }
    };
    try {
      container.register("c", c, ["user"]);
      container.register("user", user, ["c"]);
      const userInstance = container.get("user");
      userInstance.userName.name;
    } catch (e) {
      expect(e).toBe("Circular dependency has been found for user service.");
    }
  });
  it("when the dependency is not registered in container", () => {
    const container = new Container();
    const user = class User {
      constructor(userObject) {
        this.name = `${userObject.firstName} ${userObject.lastName}`;
      }
    };
    try {
      container.register("user", user, ["userDetails"]);
      const userInstance = container.get("user");
      userInstance.name;
    } catch (e) {
      expect(e).toBe(
        "The service userDetails hasn't been registered with the IOC Container"
      );
    }
  });
});
