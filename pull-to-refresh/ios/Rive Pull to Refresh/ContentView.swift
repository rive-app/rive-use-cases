//
//  ContentView.swift
//  Rive Pull to Refresh
//
//  Created by Peter G Hayes on 22/05/2023.
//

import SwiftUI
import RiveRuntime

struct ContentView: View {
    var body: some View {
        RivePullToRefreshView( content: {
            VStack {
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
                MockListTile()
            }
            
        }, onRefresh: {
            // TODO: complete future event
            try? await Task.sleep(nanoseconds: 3_000_000_000)
        })  
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
