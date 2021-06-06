//
//  ViewModel.swift
//  Easy
//
//  Created by Felix Reichenbach on 04.06.21.
//

import Foundation
import RealmSwift

class ViewModel: ObservableObject {
    
    @Published var realm: Realm?
    @Published var username: String = "demo@demo.com"
    @Published var password: String = "demo123"
    @Published var error: String = ""
    @Published var progressView: Bool = false
    
    init() {
        print("init")
        if (app.currentUser != nil) {
            openRealm()
        }
    }
    
    
    func login() {
        print("userlogin: \(username)")
        app.login(credentials: Credentials.emailPassword(email: username, password: password)) { result in
            switch result {
            case .success:
                self.openRealm()
            case .failure(let error):
                DispatchQueue.main.async {
                    print("error")
                    self.error = "Failed to log in: \(error.localizedDescription)"
                }
            }
        }
    }
    
    
    func logout() {
        print("logout")
        app.currentUser?.logOut() { result in
        }
    }
    
    
    func openRealm() {
        // If there is no user logged in, show the login view.
        guard let user = app.currentUser else {
            return
        }
        
        Realm.asyncOpen(configuration: user.configuration(partitionValue: user.id)) { result in
            switch result {
            case .failure(let error):
                print("Failed to open realm: \(error.localizedDescription)")
                // handle error
            case .success(let realm):
                print("Successfully opened realm: \(realm)")
                // Assign the realm to the state property to trigger a view refresh.
                self.realm = realm
            }
        }
    }
    
    
    func addItem() {
        print("addItem")
        try! realm?.write {
            realm?.add(Item())
        }
        /*
        DispatchQueue.main.async {
            self.error = "trigger"
        }*/
    }
}
