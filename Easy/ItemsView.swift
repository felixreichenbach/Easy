//
//  ItemsView.swift
//  Easy
//
//  Created by Felix Reichenbach on 13.06.21.
//

import SwiftUI

struct ItemsView: View {
    @ObservedObject var viewModel: ViewModel
    @State private var error: Error?
    @State private var showingAddItem = false
    
    var body: some View {
        VStack {
            // The list shows the items in the realm.
            List {
                if let items = viewModel.items { //realm?.objects(Item.self).sorted(byKeyPath: "_id", ascending: true) {
                    ForEach(items.freeze()) { item in
                        Text(item.name)
                    }
                    .onDelete(perform: delete)
                } else {
                    Text("Empty")
                }
            }
            if !viewModel.error.isEmpty {
                Text(viewModel.error)
                    .foregroundColor(.red)
            }
            Button("Add Item", action: {showingAddItem = true})
            Button("Logout", action: viewModel.logout)
        }
        .sheet(isPresented: $showingAddItem) {
            // show the add item view
            AddView(viewModel: viewModel, isPresented: $showingAddItem)
        }
    }
    
    func delete(at offsets: IndexSet) {
        viewModel.deleteItem(at: offsets)
    }
}


struct AddView: View {
    @ObservedObject var viewModel: ViewModel
    @Binding var isPresented: Bool
    
    var body: some View {
        VStack {
            HStack(alignment: .center) {
                Text("Item Name:")
                    .font(.callout)
                    .bold()
                TextField("Enter a name...", text: $viewModel.itemName)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
            }.padding()
            Button("Add", action: {
                viewModel.addItem()
                isPresented = false
            })
            Button("Dismiss", action: {isPresented = false})
        }
    }
}

struct ItemsView_Previews: PreviewProvider {
    static var previews: some View {
        ItemsView(viewModel: ViewModel())
    }
}
