//
//  EasyApp.swift
//  Easy
//
//  Created by Felix Reichenbach on 03.06.21.
//

import SwiftUI
import RealmSwift

let app: RealmSwift.App = RealmSwift.App(id: "easy-rmcgl")

@main
struct EasyApp: SwiftUI.App {
    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(app)
        }
    }
}
