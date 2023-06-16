//
//  MockListTile.swift
//  Rive Pull to Refresh
//
//  Created by Peter G Hayes on 23/05/2023.
//

import SwiftUI

import SwiftUI

struct MockListTile: View {
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text("---")
                    .font(.headline)
                
                Text("-------")
                    .font(.subheadline)
                    .foregroundColor(.white)
            }
            
            Spacer()
            
            Image(systemName: "chevron.right") // Replace with your icon/image
                .foregroundColor(.gray)
        }
        .padding()
        .background(Color.gray)
        .cornerRadius(10)
        .shadow(color: Color.gray.opacity(0.4), radius: 4, x: 0, y: 2)
        .padding(.horizontal)
    }
}

struct MockListTile_Previews: PreviewProvider {
    static var previews: some View {
        MockListTile()
            .previewLayout(.sizeThatFits)
            .padding()
    }
}
