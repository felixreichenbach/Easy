//
//  DataModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import Foundation
import RealmSwift

//final class Item: Object, ObjectKeyIdentifiable {
//    /// The unique ID of the Item.
//    @Persisted var _id : String //ObjectId //= ObjectId.generate()
//    /// The name of the Item, By default, a random name is generated.
//    @Persisted var name = "default name"
//    /// Device owner id
//    @Persisted var owner_id = "default"
//    /// Declares the _id member as the primary key to the realm.
//    override class func primaryKey() -> String? {
//        "_id"
//    }
//
//    convenience init(name: String, owner_id: String) {
//        self.init()
//        self.name = name
//        self.owner_id = owner_id
//    }
//}

class Item: Object, ObjectKeyIdentifiable {
    @Persisted(primaryKey: true) var _id = ObjectId.generate()
    @Persisted var name: String?
    @Persisted var owner_id: String?
    
    convenience init(name: String, owner_id: String) {
        self.init()
        self.name = name
        self.owner_id = owner_id
    }
    
}
