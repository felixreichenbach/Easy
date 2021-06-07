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
    
    
    //-->> read this https://github.com/realm/task-tracker-swiftui/blob/main/task-tracker-swiftui/AppState.swift
    // TODO: Notification Block on Realm change
    
    @Published var realm: Realm?
    @Published var username: String = "demo@demo.com"
    @Published var password: String = "demo123"
    @Published var error: String = ""
    @Published var progressView: Bool = false
    
    let app: RealmSwift.App = RealmSwift.App(id: "easy-rmcgl")
    
    init() {
        print("init")
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
                self.realm = realm
            case .failure(let error):
                print("Error: \(error.localizedDescription)")
            }
        }
    }
    
    
    func addItem() {
        print("addItem")
        try! realm?.write {
            realm?.add(Item())
        }
        objectWillChange.send()
    }
}
