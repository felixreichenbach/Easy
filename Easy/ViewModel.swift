//
//  ViewModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 04.06.21.
//

import Foundation
import RealmSwift
import Combine

class ViewModel: ObservableObject {
    
    //@Published var realm: Realm?
    @Published var username: String = "demo@demo.com"
    @Published var password: String = "demo123"
    @Published var error: String = ""
    @Published var itemName: String = ""
    @Published var progressView: Bool = false
    
    @Published var items: RealmSwift.Results<Item>?
    
    let app: RealmSwift.App = RealmSwift.App(id: "easy-rmcgl")
    var notificationToken: NotificationToken?
    
    init() {
        print("init")
        openRealm()
    }
    
    
    func login() {
        print("userlogin: \(username)")
        self.progressView = true
        app.login(credentials: Credentials.emailPassword(email: username, password: password)) { result in
            switch result {
            case .success:
                self.openRealm()
                DispatchQueue.main.async {
                    self.error = ""
                    self.progressView = false
                }
            case .failure(let error):
                DispatchQueue.main.async {
                    print("Failed to log in: \(error.localizedDescription)")
                    self.error = error.localizedDescription
                    self.progressView = false
                }
            }
        }
    }
    
    
    func logout() {
        print("logout")
        self.progressView = true
        self.notificationToken?.invalidate()
        app.currentUser?.logOut() { result in
        }
        self.progressView = false
    }
    
    
    func openRealm() {
        // If there is no user logged in, exit function.
        guard let user = app.currentUser else {
            return
        }
        Realm.asyncOpen(configuration: user.configuration(partitionValue: user.id)) { result in
            switch result {
            case .success(let realm):
                //self.realm = realm
                self.items = realm.objects(Item.self).sorted(byKeyPath: "_id", ascending: true)
                self.notificationToken = realm.observe { notification, realm in
                    print("Notification")
                    self.objectWillChange.send()
                }
                
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }
    
    
    func addItem() {
        print("addItem")
        try! items?.realm?.write(withoutNotifying: [notificationToken!]){
            items?.realm!.add(Item(name: itemName))
        }
        objectWillChange.send()
    }
    
    func deleteItem(at offsets: IndexSet) {
        print("delete")
        
        /*guard let realm = self.realm else {
            print("Delete Failed")
            return
        }*/
        try! items?.realm?.write(withoutNotifying: [notificationToken!]){
            items?.realm!.delete(items![offsets.first!])
        }
    }
}
