//
//  ContentView.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI
import RealmSwift

struct ContentView: View {
    
    @StateObject var viewModel = ViewModel()
    
    var body: some View {
        ZStack {
            if (viewModel.app.currentUser != nil) {
                ItemsView(viewModel: viewModel, realm: viewModel.realm)
            } else {
                LoginView(viewModel: viewModel)
            }
            if viewModel.progressView {
                ProgressView()
                    .scaleEffect(2)
            }
        }
    }
}

struct LoginView: View {
    @ObservedObject var viewModel: ViewModel
    var body: some View {
        VStack {
            Text("LoginView")
            Form {
                TextField("Username", text: $viewModel.username)
                SecureField("Password", text: $viewModel.password)
            }
            Text(viewModel.error)
                .foregroundColor(.red)
            Button("Login", action: viewModel.login)

        }
    }
}

struct ItemsView: View {
    @ObservedObject var viewModel: ViewModel
    @State private var error: Error?
    var realm: Realm?
    var body: some View {
        VStack {
            // The list shows the items in the realm.
            List {
                if let items = realm?.objects(Item.self) {
                    ForEach(items) { item in
                        Text(item.name)
                    }
                } else {
                    Text("Empty")
                }
            }
            Text("ItemView")
            Button("Add Item", action: viewModel.addItem)
            Button("Logout", action: viewModel.logout)
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
