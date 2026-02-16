#!/usr/bin/env python3
"""
🎭 The A/B Testing Architecture PDF Generator ✨

Creates a comprehensive PDF with PNG diagrams documenting the Response Blueprints
and A/B Testing system for My 4 Blocks.

- The Spellbinding Documentation Architect
"""

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Image
)
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from datetime import datetime
import os

# 🎨 Brand Colors
PURPLE_PRIMARY = HexColor('#7C3AED')
PURPLE_DARK = HexColor('#5B21B6')
PURPLE_LIGHT = HexColor('#A78BFA')
PURPLE_BG = HexColor('#F5F3FF')
SLATE_700 = HexColor('#334155')
SLATE_500 = HexColor('#64748B')
SLATE_200 = HexColor('#E2E8F0')

# 📁 Diagram paths
DIAGRAMS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'diagrams')


def create_header_footer(canvas_obj, doc):
    """🎨 Add header/footer to each page"""
    canvas_obj.saveState()

    canvas_obj.setFillColor(PURPLE_PRIMARY)
    canvas_obj.rect(0, letter[1] - 40, letter[0], 40, fill=True, stroke=False)

    canvas_obj.setFillColor(white)
    canvas_obj.setFont('Helvetica-Bold', 12)
    canvas_obj.drawString(72, letter[1] - 27, "My 4 Blocks")

    canvas_obj.setFont('Helvetica', 10)
    canvas_obj.drawRightString(letter[0] - 72, letter[1] - 27, "A/B Testing Architecture")

    canvas_obj.setFillColor(SLATE_500)
    canvas_obj.setFont('Helvetica', 9)
    canvas_obj.drawString(72, 30, f"Generated: {datetime.now().strftime('%B %d, %Y')}")
    canvas_obj.drawRightString(letter[0] - 72, 30, f"Page {doc.page}")

    canvas_obj.setStrokeColor(PURPLE_LIGHT)
    canvas_obj.setLineWidth(1)
    canvas_obj.line(72, 45, letter[0] - 72, 45)

    canvas_obj.restoreState()


def get_styles():
    """🎨 Define custom styles"""
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        'CustomTitle',
        parent=styles['Title'],
        fontSize=28,
        textColor=PURPLE_DARK,
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        'CustomH1',
        parent=styles['Heading1'],
        fontSize=20,
        textColor=PURPLE_PRIMARY,
        spaceBefore=20,
        spaceAfter=12,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        'CustomH2',
        parent=styles['Heading2'],
        fontSize=14,
        textColor=PURPLE_DARK,
        spaceBefore=15,
        spaceAfter=8,
        fontName='Helvetica-Bold'
    ))

    styles.add(ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        textColor=SLATE_700,
        spaceBefore=6,
        spaceAfter=6,
        leading=16,
        alignment=TA_JUSTIFY
    ))

    styles.add(ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontSize=10,
        textColor=PURPLE_DARK,
        backColor=PURPLE_BG,
        spaceBefore=10,
        spaceAfter=10,
        leftIndent=10,
        rightIndent=10,
        borderPadding=10
    ))

    styles.add(ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontSize=9,
        textColor=SLATE_500,
        alignment=TA_CENTER,
        spaceBefore=4,
        spaceAfter=12
    ))

    return styles


def create_cover_page(styles):
    """🎭 Create the cover page"""
    elements = []

    elements.append(Spacer(1, 2 * inch))
    elements.append(Paragraph(
        "Response Blueprints &amp;<br/>A/B Testing Architecture",
        styles['CustomTitle']
    ))

    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph(
        "Technical Documentation for My 4 Blocks",
        ParagraphStyle(
            'Subtitle',
            fontSize=14,
            textColor=SLATE_500,
            alignment=TA_CENTER
        )
    ))

    elements.append(Spacer(1, 0.5 * inch))
    description = """
    <i>"Two paths diverge in the digital wood,<br/>
    and we shall test them both, for science!"</i><br/><br/>
    A comprehensive guide to the dual-response A/B testing system<br/>
    built on the Four Blocks framework by Dr. Vincent E. Parr.
    """
    elements.append(Paragraph(description, ParagraphStyle(
        'Description',
        fontSize=12,
        textColor=SLATE_700,
        alignment=TA_CENTER,
        leading=18
    )))

    elements.append(Spacer(1, 1 * inch))
    elements.append(Paragraph(
        f"Version 1.0 - {datetime.now().strftime('%B %Y')}",
        ParagraphStyle(
            'Version',
            fontSize=11,
            textColor=SLATE_500,
            alignment=TA_CENTER
        )
    ))

    elements.append(PageBreak())
    return elements


def create_toc(styles):
    """📑 Create Table of Contents"""
    elements = []

    elements.append(Paragraph("Table of Contents", styles['CustomH1']))
    elements.append(Spacer(1, 0.2 * inch))

    toc_items = [
        ("1. Executive Summary", "3"),
        ("2. System Architecture", "4"),
        ("3. Response Blueprints", "6"),
        ("4. The Four Blocks Framework", "8"),
        ("5. Emotion Detection", "10"),
        ("6. A/B Testing Infrastructure", "11"),
        ("7. API Endpoints", "13"),
        ("8. Data Flow", "14"),
        ("9. Analytics", "15"),
    ]

    for title, page in toc_items:
        dots = "." * (55 - len(title))
        elements.append(Paragraph(
            f"{title} {dots} {page}",
            ParagraphStyle(
                'TOCItem',
                fontSize=11,
                textColor=SLATE_700,
                spaceBefore=4,
                spaceAfter=4,
            )
        ))

    elements.append(PageBreak())
    return elements


def create_executive_summary(styles):
    """📋 Executive Summary"""
    elements = []

    elements.append(Paragraph("1. Executive Summary", styles['CustomH1']))

    summary_text = """
    The My 4 Blocks A/B Testing system enables scientific comparison of two distinct
    response styles for emotional guidance. Built on Dr. Vincent E. Parr's Four Blocks
    framework, this system generates parallel AI responses using different blueprints
    and collects user preferences to optimize therapeutic effectiveness.
    """
    elements.append(Paragraph(summary_text, styles['CustomBody']))

    elements.append(Paragraph("Key Features", styles['CustomH2']))

    features = [
        "<b>Dual Response Generation:</b> Parallel streaming of Blueprint A (structured) and Blueprint B (conversational)",
        "<b>Position Bias Mitigation:</b> Random ordering prevents first-option preference skewing",
        "<b>Emotion Detection:</b> Regex-based pattern matching to identify the relevant Four Block",
        "<b>In-Memory Analytics:</b> FIFO storage with 100-entry capacity for A/B test results",
        "<b>Real-Time Streaming:</b> Both responses stream simultaneously via OpenAI SDK",
    ]

    for feature in features:
        elements.append(Paragraph(f"&bull; {feature}", styles['CustomBody']))

    elements.append(Spacer(1, 0.3 * inch))
    elements.append(Paragraph("System Specifications", styles['CustomH2']))

    specs_data = [
        ["Component", "Specification"],
        ["Model", "gpt-5.2 (latest)"],
        ["Temperature", "0.7 (balanced creativity)"],
        ["Max Tokens", "2,000 per response"],
        ["Storage Limit", "100 A/B test entries (FIFO)"],
        ["Detection Patterns", "4 blocks x 8+ regex patterns each"],
    ]

    specs_table = Table(specs_data, colWidths=[2.5*inch, 3.5*inch])
    specs_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(specs_table)

    elements.append(PageBreak())
    return elements


def create_architecture_section(styles):
    """🏗️ System Architecture with diagram"""
    elements = []

    elements.append(Paragraph("2. System Architecture", styles['CustomH1']))

    overview_text = """
    The A/B Testing architecture is a modular system with four layers: UI Layer,
    API Layer, Generation Layer, and Analytics Layer. The system generates two
    parallel responses using different blueprints and tracks user preferences.
    """
    elements.append(Paragraph(overview_text, styles['CustomBody']))

    # 🖼️ Include architecture diagram
    img_path = os.path.join(DIAGRAMS_DIR, 'ab-architecture.png')
    if os.path.exists(img_path):
        elements.append(Spacer(1, 0.2 * inch))
        img = Image(img_path, width=6.5*inch, height=5*inch)
        elements.append(img)
        elements.append(Paragraph("Figure 2.1: A/B Testing System Architecture", styles['Caption']))

    elements.append(Paragraph("Architecture Layers", styles['CustomH2']))

    arch_data = [
        ["Layer", "Components", "Description"],
        ["UI Layer", "Chat Input, ABComparison", "User interface for input and selection"],
        ["API Layer", "/api/chat/ab, /api/ab-choice", "REST endpoints for generation and recording"],
        ["Generation", "dualResponseGenerator.ts", "Parallel Blueprint A + B streaming"],
        ["Analytics", "abTesting.ts", "FIFO storage and statistics"],
    ]

    arch_table = Table(arch_data, colWidths=[1.3*inch, 2.2*inch, 2.5*inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(arch_table)
    elements.append(Paragraph("Table 2.1: Architecture Layers", styles['Caption']))

    elements.append(PageBreak())
    return elements


def create_blueprints_section(styles):
    """📘 Response Blueprints with diagram"""
    elements = []

    elements.append(Paragraph("3. Response Blueprints", styles['CustomH1']))

    intro_text = """
    Response Blueprints define the structural and tonal approach for AI-generated guidance.
    Two distinct blueprints enable scientific comparison of effectiveness.
    """
    elements.append(Paragraph(intro_text, styles['CustomBody']))

    # 🖼️ Include blueprints diagram
    img_path = os.path.join(DIAGRAMS_DIR, 'ab-blueprints.png')
    if os.path.exists(img_path):
        elements.append(Spacer(1, 0.2 * inch))
        img = Image(img_path, width=7*inch, height=7*inch)
        elements.append(img)
        elements.append(Paragraph("Figure 3.1: Blueprint A vs Blueprint B Flow", styles['Caption']))

    elements.append(PageBreak())
    elements.append(Paragraph("3.1 Blueprint A: Structured Guidance", styles['CustomH2']))

    steps_a = [
        ["Step", "Purpose", "Content"],
        ["1. Safety + Validation", "Build trust", "Acknowledge without minimizing"],
        ["2. Identify Block", "Diagnose", "Name the Four Block and formula"],
        ["3. Map Situation", "Personalize", "Use THEIR words; show ABC mapping"],
        ["4. Key Shift", "Intervene", "MUST to Preference transformation"],
        ["5. Strengths", "Empower", "Connect pain to values"],
        ["6. Question", "Engage", "One targeted question"],
    ]

    steps_table = Table(steps_a, colWidths=[1.5*inch, 1.2*inch, 3.3*inch])
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(steps_table)
    elements.append(Paragraph("Table 3.1: Blueprint A Six-Step Protocol", styles['Caption']))

    elements.append(Paragraph("3.2 Blueprint B: Conversational Guidance", styles['CustomH2']))

    blueprint_b_desc = """
    Blueprint B uses a fluid, exploratory approach that feels like conversation with a wise friend.
    Uses "I wonder if..." language to invite discovery rather than prescribe solutions.
    """
    elements.append(Paragraph(blueprint_b_desc, styles['CustomBody']))

    comparison_data = [
        ["Aspect", "Blueprint A", "Blueprint B"],
        ["Tone", "Direct, methodical", "Warm, exploratory"],
        ["Structure", "Rigid 6-step protocol", "Fluid, adaptive"],
        ["Language", '"Here\'s the formula..."', '"I wonder if..."'],
        ["Framework", "Explicitly stated", "Gently woven in"],
        ["Best For", "Users wanting clarity", "Users wanting connection"],
    ]

    comparison_table = Table(comparison_data, colWidths=[1.2*inch, 2.4*inch, 2.4*inch])
    comparison_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (0, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(comparison_table)
    elements.append(Paragraph("Table 3.2: Blueprint Comparison", styles['Caption']))

    elements.append(PageBreak())
    return elements


def create_four_blocks_section(styles):
    """🔮 The Four Blocks Framework with diagram"""
    elements = []

    elements.append(Paragraph("4. The Four Blocks Framework", styles['CustomH1']))

    framework_intro = """
    The Four Blocks framework identifies four fundamental emotional patterns that cause
    human suffering. Each block has a distinct formula and requires a specific intervention.
    """
    elements.append(Paragraph(framework_intro, styles['CustomBody']))

    # 🖼️ Include four blocks diagram
    img_path = os.path.join(DIAGRAMS_DIR, 'ab-four-blocks.png')
    if os.path.exists(img_path):
        elements.append(Spacer(1, 0.2 * inch))
        img = Image(img_path, width=7*inch, height=6*inch)
        elements.append(img)
        elements.append(Paragraph("Figure 4.1: Four Blocks Detection and Intervention", styles['Caption']))

    elements.append(PageBreak())
    elements.append(Paragraph("Block Formulas", styles['CustomH2']))

    blocks_data_1 = [
        ["Block", "Formula"],
        ["ANGER", "Frustration + DEMAND = Anger"],
        ["ANXIETY", "Concern + CATASTROPHIZING = Anxiety"],
        ["DEPRESSION", "Disappointment + SELF-RATING = Depression"],
        ["GUILT", "Regret + MORAL DEMAND = Guilt"],
    ]

    blocks_table_1 = Table(blocks_data_1, colWidths=[1.5*inch, 4.5*inch])
    blocks_table_1.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(blocks_table_1)
    elements.append(Paragraph("Table 4.1: The Four Blocks Formulas", styles['Caption']))

    elements.append(Paragraph("Key Shifts", styles['CustomH2']))

    blocks_data_2 = [
        ["Block", "Core Belief", "Key Shift"],
        ["ANGER", "Others MUST be different", '"They SHOULD" to "I\'d prefer"'],
        ["ANXIETY", "Bad things MUST NOT happen", '"What if!" to "I can cope"'],
        ["DEPRESSION", "I MUST be worthy (identity)", '"I AM failure" to "I failed at X"'],
        ["GUILT", "I MUST NOT have done that", '"I shouldn\'t have" to "I wish"'],
    ]

    blocks_table_2 = Table(blocks_data_2, colWidths=[1.5*inch, 2.25*inch, 2.25*inch])
    blocks_table_2.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(blocks_table_2)
    elements.append(Paragraph("Table 4.2: Core Beliefs and Key Shifts", styles['Caption']))

    elements.append(Paragraph("Critical: Depression vs Guilt", styles['CustomH2']))

    distinction_text = """
    <b>DEPRESSION</b> attacks <i>WHO you ARE</i> ("I am worthless") - rates the entire self.<br/><br/>
    <b>GUILT</b> attacks <i>WHAT you DID</i> ("I shouldn't have done that") - rates the action.<br/><br/>
    Different cure: Depression needs "You're not your failures." Guilt needs "You're allowed to be fallible."
    """
    elements.append(Paragraph(distinction_text, styles['Callout']))

    elements.append(PageBreak())
    return elements


def create_emotion_detection_section(styles):
    """🔍 Emotion Detection"""
    elements = []

    elements.append(Paragraph("5. Emotion Detection System", styles['CustomH1']))

    detection_intro = """
    The emotion detection system uses regex pattern matching to identify which of the
    Four Blocks the user is likely experiencing. This enables personalized responses.
    """
    elements.append(Paragraph(detection_intro, styles['CustomBody']))

    elements.append(Paragraph("Detection Algorithm", styles['CustomH2']))

    algorithm_desc = """
    The detectLikelyBlock() function checks patterns in order of specificity:<br/><br/>
    <b>1. Depression patterns</b> (most specific - global self-rating)<br/>
    <b>2. Guilt patterns</b> (action-focused regret)<br/>
    <b>3. Anxiety patterns</b> (future catastrophizing)<br/>
    <b>4. Anger patterns</b> (demands on others/situations)<br/><br/>
    If no pattern matches, returns null to let the AI decide.
    """
    elements.append(Paragraph(algorithm_desc, styles['CustomBody']))

    elements.append(Paragraph("Pattern Examples", styles['CustomH2']))

    patterns_data = [
        ["Block", "Pattern Example", "Sample Trigger"],
        ["Depression", '/i am (a )?failure/', '"I\'m such a loser"'],
        ["Guilt", '/i should not have/', '"I shouldn\'t have said that"'],
        ["Anxiety", '/what if/', '"What if it goes wrong?"'],
        ["Anger", '/(they|he|she) should/', '"He shouldn\'t treat me this way"'],
    ]

    patterns_table = Table(patterns_data, colWidths=[1.2*inch, 2.0*inch, 2.8*inch])
    patterns_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(patterns_table)
    elements.append(Paragraph("Table 5.1: Emotion Detection Patterns", styles['Caption']))

    elements.append(PageBreak())
    return elements


def create_ab_testing_section(styles):
    """🧪 A/B Testing Infrastructure"""
    elements = []

    elements.append(Paragraph("6. A/B Testing Infrastructure", styles['CustomH1']))

    elements.append(Paragraph("6.1 Storage System", styles['CustomH2']))

    storage_intro = """
    The A/B testing storage uses in-memory FIFO eviction to maintain a rolling window
    of test results for development and initial analysis.
    """
    elements.append(Paragraph(storage_intro, styles['CustomBody']))

    storage_features = [
        "<b>MAX_ENTRIES:</b> 100 test entries (configurable)",
        "<b>FIFO Eviction:</b> Oldest entries removed when at capacity",
        "<b>Unique IDs:</b> timestamp + random suffix (e.g., ab_lx3k2p_7f9m2)",
        "<b>Metadata:</b> model, temperature, detected block, response times",
    ]

    for feature in storage_features:
        elements.append(Paragraph(f"&bull; {feature}", styles['CustomBody']))

    elements.append(Paragraph("ABTestEntry Structure", styles['CustomH2']))

    structure_data = [
        ["Field", "Type", "Description"],
        ["id", "string", "Unique test identifier"],
        ["timestamp", "string", "ISO timestamp"],
        ["userQuery", "string", "Original user message"],
        ["responseA", "string", "Blueprint A response"],
        ["responseB", "string", "Blueprint B response"],
        ["userChoice", "'A' | 'B' | null", "User's preference"],
        ["metadata.modelA", "string?", "Model used for A"],
        ["metadata.detectedBlock", "string?", "Detected Four Block"],
    ]

    structure_table = Table(structure_data, colWidths=[1.8*inch, 1.5*inch, 2.7*inch])
    structure_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(structure_table)
    elements.append(Paragraph("Table 6.1: ABTestEntry Data Structure", styles['Caption']))

    elements.append(Paragraph("6.2 Dual Response Generator", styles['CustomH2']))

    gen_flow = [
        "1. prepareDualGeneration() builds system prompts for both A and B",
        "2. PARALLEL: Two GPT-5.2 API calls launched simultaneously",
        "3. Stream chunks delivered to UI as they arrive",
        "4. createDualResponseResult() assembles final result with timing",
        "5. storeABTest() saves to in-memory storage with unique ID",
    ]

    for step in gen_flow:
        elements.append(Paragraph(step, styles['CustomBody']))

    elements.append(PageBreak())
    return elements


def create_api_section(styles):
    """🌐 API Endpoints"""
    elements = []

    elements.append(Paragraph("7. API Endpoints", styles['CustomH1']))

    endpoints_data = [
        ["Endpoint", "Method", "Purpose"],
        ["POST /api/chat/ab", "POST", "Generate dual A/B responses"],
        ["POST /api/ab-choice", "POST", "Record user's choice"],
        ["GET /api/ab-choice", "GET", "Get A/B test statistics"],
    ]

    endpoints_table = Table(endpoints_data, colWidths=[2.0*inch, 1.0*inch, 3.0*inch])
    endpoints_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 8),
    ]))
    elements.append(endpoints_table)
    elements.append(Paragraph("Table 7.1: A/B Testing API Endpoints", styles['Caption']))

    elements.append(Paragraph("POST /api/chat/ab Response", styles['CustomH2']))

    resp_data = [
        ["Field", "Example Value"],
        ["abTestId", '"ab_lx3k2p_7f9m2"'],
        ["responseA", '"What you\'re experiencing makes sense..."'],
        ["responseB", '"Oh man, that sounds rough..."'],
        ["context.detectedBlock", '"Anger"'],
    ]
    resp_table = Table(resp_data, colWidths=[2.0*inch, 4.0*inch])
    resp_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), SLATE_200),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('GRID', (0, 0), (-1, -1), 0.5, SLATE_500),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(resp_table)

    elements.append(PageBreak())
    return elements


def create_data_flow_section(styles):
    """🔄 Data Flow with diagram"""
    elements = []

    elements.append(Paragraph("8. Data Flow", styles['CustomH1']))

    flow_intro = """
    The complete data flow from user input to analytics shows how the system
    processes queries, generates dual responses, and tracks preferences.
    """
    elements.append(Paragraph(flow_intro, styles['CustomBody']))

    # 🖼️ Include data flow diagram
    img_path = os.path.join(DIAGRAMS_DIR, 'ab-data-flow.png')
    if os.path.exists(img_path):
        elements.append(Spacer(1, 0.2 * inch))
        img = Image(img_path, width=6.5*inch, height=4*inch)
        elements.append(img)
        elements.append(Paragraph("Figure 8.1: Complete A/B Testing Data Flow", styles['Caption']))

    elements.append(Paragraph("Flow Steps", styles['CustomH2']))

    flow_data = [
        ["Step", "Component", "Action"],
        ["1", "User", "Types message in Chat Input"],
        ["2", "Client", "POST /api/chat/ab with messages"],
        ["3", "Server", "detectLikelyBlock(userQuery)"],
        ["4", "RAG", "findRelevantWisdom(query, 5)"],
        ["5", "Prompts", "buildEnhancedSystemPrompt A + B"],
        ["6", "GPT-5.2", "PARALLEL streaming both blueprints"],
        ["7", "Storage", "storeABTest() with unique ID"],
        ["8", "UI", "ABResponseComparison displays both"],
        ["9", "User", "Clicks 'Choose This'"],
        ["10", "Analytics", "recordChoice() and getABStats()"],
    ]

    flow_table = Table(flow_data, colWidths=[0.6*inch, 1.2*inch, 4.2*inch])
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('ALIGN', (1, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(flow_table)
    elements.append(Paragraph("Table 8.1: Data Flow Steps", styles['Caption']))

    elements.append(PageBreak())
    return elements


def create_analytics_section(styles):
    """📊 Analytics"""
    elements = []

    elements.append(Paragraph("9. Analytics and Metrics", styles['CustomH1']))

    metrics_data = [
        ["Metric", "Description", "API Function"],
        ["Total Tests", "Number of A/B tests conducted", "getABStats().total"],
        ["With Choice", "Tests where user made selection", "getABStats().withChoice"],
        ["A Win Rate", "Percentage choosing Blueprint A", "getABStats().aWinRate"],
        ["B Win Rate", "Percentage choosing Blueprint B", "getABStats().bWinRate"],
        ["No Choice", "Tests abandoned", "getABStats().noChoice"],
    ]

    metrics_table = Table(metrics_data, colWidths=[1.3*inch, 2.2*inch, 2.5*inch])
    metrics_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(metrics_table)
    elements.append(Paragraph("Table 9.1: Analytics Metrics", styles['Caption']))

    elements.append(Paragraph("Sample Statistics", styles['CustomH2']))

    stats_data = [
        ["Field", "Value", "Description"],
        ["total", "87", "Total A/B tests"],
        ["withChoice", "72", "Tests with selection"],
        ["aWins", "31", "Blueprint A chosen"],
        ["bWins", "41", "Blueprint B chosen"],
        ["aWinRate", "43.1%", "A win percentage"],
        ["bWinRate", "56.9%", "B win percentage"],
    ]

    stats_table = Table(stats_data, colWidths=[1.3*inch, 1.2*inch, 3.5*inch])
    stats_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), PURPLE_PRIMARY),
        ('TEXTCOLOR', (0, 0), (-1, 0), white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BACKGROUND', (0, 1), (-1, -1), PURPLE_BG),
        ('GRID', (0, 0), (-1, -1), 0.5, PURPLE_LIGHT),
        ('PADDING', (0, 0), (-1, -1), 6),
    ]))
    elements.append(stats_table)
    elements.append(Paragraph("Table 9.2: Sample Statistics Response", styles['Caption']))

    elements.append(Paragraph("Future Enhancements", styles['CustomH2']))

    future_items = [
        "Persistent storage (PostgreSQL/Redis) for long-term analytics",
        "Time-series analysis of preference trends",
        "Statistical significance testing",
        "User cohort analysis",
    ]

    for item in future_items:
        elements.append(Paragraph(f"&bull; {item}", styles['CustomBody']))

    return elements


def main():
    """🎭 Main function"""
    print("PDF GENERATION: Creating A/B Testing Architecture document with diagrams...")

    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, "My4Blocks_AB_Testing_Architecture.pdf")

    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        topMargin=60,
        bottomMargin=60,
        leftMargin=72,
        rightMargin=72
    )

    styles = get_styles()
    elements = []

    elements.extend(create_cover_page(styles))
    elements.extend(create_toc(styles))
    elements.extend(create_executive_summary(styles))
    elements.extend(create_architecture_section(styles))
    elements.extend(create_blueprints_section(styles))
    elements.extend(create_four_blocks_section(styles))
    elements.extend(create_emotion_detection_section(styles))
    elements.extend(create_ab_testing_section(styles))
    elements.extend(create_api_section(styles))
    elements.extend(create_data_flow_section(styles))
    elements.extend(create_analytics_section(styles))

    doc.build(elements, onFirstPage=create_header_footer, onLaterPages=create_header_footer)

    print(f"PDF GENERATION COMPLETE!")
    print(f"Output: {output_path}")

    return output_path


if __name__ == "__main__":
    main()
