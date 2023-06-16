//
//  CustomRefreshView.swift
//  Rive Pull to Refresh
//
//  Created by Peter G Hayes on 22/05/2023.
//

import SwiftUI
import RiveRuntime

struct RivePullToRefreshView<Content: View>: View {
    var content: Content
    var showsIndicator: Bool
    var onRefresh: ()async->()
    var height: Double
    
    
    init(showsIndicator: Bool = false, height: Double = 200, @ViewBuilder content: @escaping ()-> Content, onRefresh: @escaping ()async->()) {
        self.showsIndicator = showsIndicator
        self.content = content()
        self.onRefresh = onRefresh
        self.height = height
        _scrollDelegate = StateObject(wrappedValue: ScrollViewModel(height: height))
    }
    
    @StateObject var riveViewModel = RiveViewModel(fileName: "pull_to_refresh_use_case", fit: .cover, autoPlay: false)
    @StateObject var scrollDelegate: ScrollViewModel
    
    
    var body: some View {
        ScrollView(.vertical, showsIndicators: showsIndicator) {
            VStack {
                if (scrollDelegate.progress > 0) {
                    riveViewModel.view()
                        .frame(height: height * scrollDelegate.progress)
                        .offset(y: scrollDelegate.isEligible ?  -(scrollDelegate.contentOffset < 0 ? 0 :scrollDelegate.contentOffset) : -(scrollDelegate.scrollOffset < 0 ? 0 : scrollDelegate.scrollOffset))
                }
                
                content
                
            }
            .offset(coordinateSpace: "SCROLL") { offset in
                // MARK: Storing content offset
                scrollDelegate.contentOffset = offset
                
                // MARK: Stopping the progress when it's eligible for refresh
                if !scrollDelegate.isEligible {
                    
                    var progress = offset / height
                    progress = (progress < 0 ? 0 : progress)
                    progress = (progress > 1 ? 1 : progress)
                    scrollDelegate.scrollOffset = offset
                    scrollDelegate.progress = progress
                }
                let inputValue = offset / height * 100
                riveViewModel.setInput("pull", value: inputValue)
                
                /// Drag is released and pull to refresh is not eligible - reset Rive view model when hidden
                if (scrollDelegate.progress == 0 && scrollDelegate.isEligible == false) {
                    riveViewModel.reset()
                }
                
                if scrollDelegate.isEligible && !scrollDelegate.isRefreshing  {
                    scrollDelegate.isRefreshing = true
                    // MARK: Haptic Feedback
                    
                    UIImpactFeedbackGenerator(style: .medium).impactOccurred()
                }
            }
        }
        .coordinateSpace(name: "SCROLL")
        .onAppear(perform: scrollDelegate.addGesture)
        .onDisappear(perform: scrollDelegate.removeGesture)
        .onChange(of: scrollDelegate.isRefreshing) { refreshing in
            // MARK: Calling Async method
            if refreshing{
                Task{
                    riveViewModel.triggerInput("advance")
                    let backTime = 0.25
                    await onRefresh()
                    // Let the animation finish
                    riveViewModel.triggerInput("advance")
                    try? await Task.sleep(for: .seconds(2))
                    // MARK: After refresh done restting properties
                    withAnimation(.easeInOut(duration: backTime)){
                        scrollDelegate.progress = 0
                        scrollDelegate.isEligible = false
                        scrollDelegate.isRefreshing = false
                        scrollDelegate.scrollOffset = 0
                    }
                    
                    try? await Task.sleep(for: .seconds(backTime))
                    riveViewModel.reset()
                }
            }
        }
    }
}


// MARK: For simultaneous pan gesture
class ScrollViewModel: NSObject, ObservableObject, UIGestureRecognizerDelegate {
    var height: Double
    
    // MARK: Properties
    @Published var isEligible: Bool = false
    @Published var isRefreshing: Bool = false
    // MARK: Offsets and Progress
    @Published var scrollOffset: CGFloat = 0
    @Published var contentOffset: CGFloat = 0
    @Published var progress: CGFloat = 0
    
    init(height: Double) {
        self.height = height
    }
    
    // MARK: Since we need to know when the user left the screen to start refresh
    // Adding pan gesture to UI Main Appliction Window
    func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
        return true
    }
    
    // MARK: Adding Gesture
    func addGesture() {
        let panGesture = UIPanGestureRecognizer(target: self, action:
                                                    #selector(onGestureChange(gesture:)))
        panGesture.delegate = self
        
        rootController().view.addGestureRecognizer(panGesture)
    }
    
    // MARK: Removing when leaving the view
    func removeGesture() {
        rootController().view.gestureRecognizers?.removeAll()
    }
    
    // MARK: Finding root controller
    func rootController() -> UIViewController{
        guard let screen = UIApplication.shared.connectedScenes.first as? UIWindowScene
        else {
            return .init()
        }
        
        guard let root = screen.windows.first?.rootViewController else {
            return .init()
        }
        
        return root;
    }
    
    @objc
    func onGestureChange(gesture: UIPanGestureRecognizer) {
        if gesture.state == .cancelled || gesture.state == .ended {
            // User let go of drag
            if !isRefreshing{
                if scrollOffset > height {
                    isEligible = true
                } else {
                    isEligible = false
                }
            }
        }
    }
}


// MARK: Offset Modifier
extension View {
    @ViewBuilder
    func offset(coordinateSpace: String, offset: @escaping (CGFloat)->()) ->some View {
        self
            .overlay {
                GeometryReader{geometry in
                    let minY = geometry.frame(in: .named(coordinateSpace)).minY
                    Color.clear
                        .preference(key: OffsetKey.self, value: minY)
                        .onPreferenceChange(OffsetKey.self) { value in
                            offset(value)
                        }
                }
            }
    }
}

// MARK: Offset Preference Key
struct OffsetKey: PreferenceKey{
    static var defaultValue: CGFloat = 0
    
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}


struct CustomRefreshView_Previews: PreviewProvider {
    static var previews: some View {
        RivePullToRefreshView() {
            MockListTile()
            MockListTile()
            MockListTile()
            MockListTile()
        } onRefresh: {
            try? await Task.sleep(nanoseconds: 3_000_000_000)
        }
    }
}
