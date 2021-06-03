//
//  ContentView.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI
import RealmSwift

struct ContentView: View {
    // Observe the Realm app object in order to react to login state changes.
    @ObservedObject var app: RealmSwift.App
    
    @State var realm: Realm?
    
    var body: some View {
        // If there is no user logged in, show the login view.
        guard let user = app.currentUser else {
            return AnyView(LoginView(app: app))
        }
        // If logged in but the realm is not open yet, then show a progress spinner
        // while opening the realm. Realm.asyncOpen() downloads the remote changes before
        // the realm opens, which might take a moment.
        guard let realm = realm else {
            return AnyView(ProgressView() // Show the activity indicator while the realm loads
                .onReceive(Realm.asyncOpen(configuration: user.configuration(partitionValue: user.id)).assertNoFailure()) { realm in
                    // Preload one group if it does not exist. This app only ever allows
                    // one group per user partition, but you could expand it to allow many groups.
                    if realm.objects(Item.self).count == 0 {
                        try! realm.write {
                            realm.add(Item())
                        }
                    }
                    // Assign the realm to the state property to trigger a view refresh.
                    self.realm = realm
                })
        }
        // If logged in and the realm has been opened, then go to the items
        // screen for the only group in the realm.
        return AnyView(ItemsView(item: realm.objects(Item.self).first!))
        // Pass the app to descendents via this environment object.
    }
}

struct LoginView: View {
    // Observe the Realm app object in order to react to login state changes.
    @ObservedObject var app: RealmSwift.App
    
    @State private var error: Error?
    @State private var username: String = ""
    @State private var password: String = ""
    
    var body: some View {
        VStack {
        Text("LoginView")
        Form {
            TextField("Username", text: $username)
            SecureField("Password", text: $password)
        }
        Button("Login", action: login)
        }
    }
    
    func login() {
        print("login")
        app.login(credentials: .anonymous) { result in
            if case let .failure(error) = result {
                print("Failed to log in: \(error.localizedDescription)")
                // Set error to observed property so it can be displayed
                self.error = error
                return
            }
        }
    }
}

struct ItemsView: View {
    
    @ObservedRealmObject var item: Item
    
    @State private var error: Error?
    
    var body: some View {
        
        VStack {
            Text("ItemView")
            Button("Logout", action: logout)
        }

    }
    
    func logout() {
        print("logout")
        guard let user = app.currentUser else {
            return
        }
        user.logOut() { error in
            // Other views are observing the app and will detect
            // that the currentUser has changed. Nothing more to do here.
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(app: App(id: "easy-rmcgl"))
    }
}
