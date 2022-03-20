//
//  DataModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import Foundation
import RealmSwift

final class Item: Object, ObjectKeyIdentifiable {
    /// The unique ID of the Item.
    @objc dynamic var _id = ObjectId.generate()
    /// The name of the Item, By default, a random name is generated.
    @objc dynamic var name = "default name"
    /// Device owner id
    @objc dynamic var owner_id = "default"
    /// Declares the _id member as the primary key to the realm.
    override class func primaryKey() -> String? {
        "_id"
    }
    
    convenience init(name: String) {
        self.init()
        self.name = name
    }
}
