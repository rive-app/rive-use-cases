import 'package:easy_refresh/easy_refresh.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pull_to_refresh_rive_flutter/skeleton_item.dart';
import 'package:rive/rive.dart';

const kDefaultArcheryTriggerOffset = 200.0;

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Material App',
      themeMode: ThemeMode.dark,
      darkTheme: ThemeData.dark(useMaterial3: true).copyWith(
        colorScheme: ColorScheme.fromSeed(
            seedColor: Colors.green, brightness: Brightness.dark),
      ),
      home: const ArcheryPage(),
    );
  }
}

class ArcheryPage extends StatefulWidget {
  const ArcheryPage({Key? key}) : super(key: key);

  @override
  State<ArcheryPage> createState() => _ArcheryPageState();
}

class _ArcheryPageState extends State<ArcheryPage> {
  int _count = 10;
  late EasyRefreshController _controller;

  @override
  void initState() {
    super.initState();
    _controller = EasyRefreshController(
      controlFinishRefresh: true,
      controlFinishLoad: true,
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: EasyRefresh(
        controller: _controller,
        header: const ArcheryHeader(
          position: IndicatorPosition.locator,
          processedDuration: Duration(seconds: 1),
        ),
        onRefresh: () async {
          await Future.delayed(const Duration(seconds: 2));
          if (!mounted) {
            return;
          }
          setState(() {
            _count = 10;
          });
          _controller.finishRefresh();
          _controller.resetFooter();
        },
        child: CustomScrollView(
          slivers: [
            const SliverAppBar(
              title: Text('Shooting practice'),
              pinned: true,
            ),
            const HeaderLocator.sliver(),
            SliverList(
              delegate: SliverChildBuilderDelegate(
                (context, index) {
                  return const SkeletonItem();
                },
                childCount: _count,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ArcheryHeader extends Header {
  const ArcheryHeader({
    super.clamping = false,
    super.triggerOffset = kDefaultArcheryTriggerOffset,
    super.position = IndicatorPosition.above,
    super.processedDuration = Duration.zero,
    super.springRebound = false,
    super.hapticFeedback = false,
    super.safeArea = false,
    super.spring,
    super.readySpringBuilder,
    super.frictionFactor,
    super.infiniteOffset,
    super.hitOver,
    super.infiniteHitOver,
  });

  @override
  Widget build(BuildContext context, IndicatorState state) {
    return _ArcheryIndicator(
      state: state,
      reverse: state.reverse,
    );
  }
}

class _ArcheryIndicator extends StatefulWidget {
  /// Indicator properties and state.
  final IndicatorState state;

  /// True for up and left.
  /// False for down and right.
  final bool reverse;

  const _ArcheryIndicator({
    Key? key,
    required this.state,
    required this.reverse,
  }) : super(key: key);

  @override
  State<_ArcheryIndicator> createState() => _ArcheryIndicatorState();
}

class _ArcheryIndicatorState extends State<_ArcheryIndicator> {
  double get _offset => widget.state.offset;
  IndicatorMode get _mode => widget.state.mode;
  double get _actualTriggerOffset => widget.state.actualTriggerOffset;

  SMINumber? pull;
  SMITrigger? advance;
  StateMachineController? controller;

  @override
  void initState() {
    super.initState();
    widget.state.notifier.addModeChangeListener(_onModeChange);
    _loadRiveFile();
  }

  RiveFile? _riveFile;
  void _loadRiveFile() {
    rootBundle.load('assets/pull_to_refresh_use_case.riv').then(
      (data) async {
        // Load the RiveFile from the binary data.
        setState(() {
          _riveFile = RiveFile.import(data);
        });
      },
    );
  }

  @override
  void dispose() {
    widget.state.notifier.removeModeChangeListener(_onModeChange);
    controller?.dispose();
    // _riveFile = null;
    super.dispose();
  }

  /// Mode change listener.
  void _onModeChange(IndicatorMode mode, double offset) {
    // print(mode);
    switch (mode) {
      case IndicatorMode.drag:
        controller?.isActive = true;
      case IndicatorMode.ready:
        advance?.fire();
      case IndicatorMode.processed:
        advance?.fire();
      default:
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_mode == IndicatorMode.drag || _mode == IndicatorMode.armed) {
      final percentage = (_offset / _actualTriggerOffset).clamp(0.0, 1.1) * 100;
      pull?.value = percentage;
    }
    return SizedBox(
      width: double.infinity,
      height: _offset,
      child: (_offset > 0 && _riveFile != null)
          ? RiveAnimation.direct(
              _riveFile!,
              artboard: 'Bullseye',
              fit: BoxFit.cover,
              onInit: (artboard) {
                controller = StateMachineController.fromArtboard(
                    artboard, 'numberSimulation')!;
                controller?.isActive = false;
                if (controller == null) {
                  throw Exception(
                      'Unable to initialize state machine controller');
                }
                artboard.addController(controller!);
                pull = controller!.findInput<double>('pull') as SMINumber;
                advance = controller!.findInput<bool>('advance') as SMITrigger;
              },
            )
          : const SizedBox.shrink(),
    );
  }
}
